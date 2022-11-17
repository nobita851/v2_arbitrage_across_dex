//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

// import "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract arbitrage is Ownable{

    address token0;
    address token1;

    address[] routers;

    constructor(address _token0, address _token1, address[] memory _routers){
        token0 = _token0;
        token1 = _token1;

        routers = _routers;
    }

	function swap(address router, address _tokenIn, address _tokenOut, uint256 _amount) private {
		IERC20(_tokenIn).approve(router, _amount);
		address[] memory path;
		path = new address[](2);
		path[0] = _tokenIn;
		path[1] = _tokenOut;
		uint deadline = block.timestamp + 300;
		IUniswapV2Router02(router).swapExactTokensForTokens(_amount, 1, path, address(this), deadline);
	}

	function getAmountOutMin(address router, address _tokenIn, address _tokenOut, uint256 _amount) public view returns (uint256) {
		address[] memory path;
		path = new address[](2);
		path[0] = _tokenIn;
		path[1] = _tokenOut;
		uint256[] memory amountOutMins = IUniswapV2Router02(router).getAmountsOut(_amount, path);
		return amountOutMins[path.length -1];
	}
}