//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

// import "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-core/contracts/interfaces/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract arbitrage is Ownable{

    uint256 balance;

    address token0;
    address token1;

    // address[] routers; storing and calculating price difference off-chain is effective

    constructor(address _token0, address _token1 /* ,address[] memory _routers */){
        token0 = _token0;
        token1 = _token1;

        // routers = _routers;
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

	function getAmountOut(address router, uint256 _amount) public view returns (uint256) {
		address[] memory path;
		path = new address[](2);
		path[0] = token0;
		path[1] = token1;
		uint256[] memory amountOut = IUniswapV2Router02(router).getAmountsOut(_amount, path);
		return amountOut[amountOut.length - 1];
	}

    function trade(address routerBuy, address routerSell) external{
        
        IERC20(token0).approve(routerBuy, balance);
        
        address[] memory path;
		path = new address[](2);
		path[0] = token0;
		path[1] = token1;
		uint256[] memory amountOut = IUniswapV2Router02(routerBuy).swapExactTokensForTokens(balance, 0, path, address(this), block.timestamp + 60);
        uint256 token1Received = amountOut[amountOut.length - 1];

        IERC20(token1).approve(routerSell, token1Received);
        
        path[0] = token1;
		path[1] = token0;
		amountOut = IUniswapV2Router02(routerSell).swapExactTokensForTokens(token1Received, 0, path, address(this), block.timestamp + 60);
        uint256 _balance = amountOut[amountOut.length - 1];

        require(_balance > balance, "Trade Reverted! Loss making trade");
        balance = _balance;
    }

    function depositFunds(uint256 amount) external{
        IERC20(token0).transferFrom(msg.sender, address(this), amount);
        balance += amount;
    }

    function withdrawFunds(uint256 amount) external onlyOwner {
        require(balance >= amount, "Error! Amount Exceeds Balance");
        IERC20(token0).transfer(msg.sender, amount);
        balance -= amount;
    }

    function checkBalance() external view returns(uint256, uint256){
        return(IERC20(token0).balanceOf(address(this)), IERC20(token1).balanceOf(address(this)));
    }
}