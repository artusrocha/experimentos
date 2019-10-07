package com.example.refactoring;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

public class PedidoServiceImpl2 implements PedidoService {

	private static final BigDecimal COM_CLIENTE_PEDIDO_MAIOR_Q_5 = new BigDecimal("0.9");
	private static final BigDecimal COM_CLIENTE_PEDIDO_MENOR_Q_5 = new BigDecimal("0.95");
	private static final BigDecimal SEM_CLIENTE_PEDIDO_MAIOR_Q_5 = new BigDecimal("0.95");
	private static final BigDecimal SEM_CLIENTE_PEDIDO_MENOR_Q_5 = new BigDecimal("0.98");

	public PedidoServiceImpl2(@Autowired ClientService clienteService) {
		super();
		this.clienteService = clienteService;
	}

	private ClientService clienteService;

	public BigDecimal calculaTotal(String cpf, List<PedidoItem> p) {
		BigDecimal resultado = BigDecimal.ZERO;

		// Boolean clienteExiste = clienteService.existsByCpf(cpf);
		Optional<Client> cliente = clienteService.findByCpf(cpf);

		for (int i = 0; i < p.size(); i++) {
			PedidoItem pedido = p.get(i);
			Produto produto = pedido.getProduto();
			if (pedido.getQuantidade() >= 5) {
				if (cliente.isPresent()) {
					resultado = resultado.add(produto.getPreco().multiply(COM_CLIENTE_PEDIDO_MAIOR_Q_5)
							.multiply(new BigDecimal(pedido.getQuantidade())));
				} else {
					resultado = resultado.add(produto.getPreco().multiply(COM_CLIENTE_PEDIDO_MENOR_Q_5)
							.multiply(new BigDecimal(pedido.getQuantidade())));
				}
			} else {
				if (cliente.isPresent()) {
					resultado = resultado.add(produto.getPreco().multiply(SEM_CLIENTE_PEDIDO_MAIOR_Q_5)
							.multiply(new BigDecimal(pedido.getQuantidade())));
				} else {
					resultado = resultado.add(produto.getPreco().multiply(SEM_CLIENTE_PEDIDO_MENOR_Q_5)
							.multiply(new BigDecimal(pedido.getQuantidade())));
				}
			}
		}

		return resultado;
	}

}
