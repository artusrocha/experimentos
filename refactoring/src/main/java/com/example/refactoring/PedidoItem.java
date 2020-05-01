package com.example.refactoring;

public class PedidoItem {

	private Integer quantidade;
	private Produto produto;
	
	
	public PedidoItem(Integer quantidade, Produto produto) {
		super();
		this.quantidade = quantidade;
		this.produto = produto;
	}

	public Produto getProduto() {
		return produto;
	}

	public int getQuantidade() {
		return quantidade;
	}

}
