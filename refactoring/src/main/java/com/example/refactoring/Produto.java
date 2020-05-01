package com.example.refactoring;

import java.math.BigDecimal;

public class Produto {

	private BigDecimal preco;

	public Produto(BigDecimal preco) {
		super();
		this.preco = preco;
	}

	public BigDecimal getPreco() {
		return preco;
	}

}
