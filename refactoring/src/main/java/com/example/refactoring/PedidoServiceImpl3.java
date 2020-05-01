package com.example.refactoring;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

public class PedidoServiceImpl3 implements PedidoService {

	private static final BigDecimal COM_CLIENTE_PEDIDO_MAIOR_Q_5 = new BigDecimal("0.9");
	private static final BigDecimal COM_CLIENTE_PEDIDO_MENOR_Q_5 = new BigDecimal("0.95");
	private static final BigDecimal SEM_CLIENTE_PEDIDO_MAIOR_Q_5 = new BigDecimal("0.95");
	private static final BigDecimal SEM_CLIENTE_PEDIDO_MENOR_Q_5 = new BigDecimal("0.98");

	public PedidoServiceImpl3(@Autowired ClientService clienteService) {
		super();
		this.clienteService = clienteService;
	}

	private ClientService clienteService;

	public BigDecimal calculaTotal(String cpf, List<PedidoItem> p) {
		BigDecimal resultado = BigDecimal.ZERO;

		Optional<Client> cliente = clienteService.findByCpf(cpf);

		for (int i = 0; i < p.size(); i++) {
			PedidoItem pedido = p.get(i);
			if (pedido.getQuantidade() >= 5) {
				if (cliente.isPresent()) {
					resultado = resultado.add( calculaDesconto( pedido, COM_CLIENTE_PEDIDO_MAIOR_Q_5) );
				} else {
					resultado = resultado.add( calculaDesconto( pedido, COM_CLIENTE_PEDIDO_MENOR_Q_5) );
				}
			} else {
				if (cliente.isPresent()) {
					resultado = resultado.add( calculaDesconto(pedido, SEM_CLIENTE_PEDIDO_MAIOR_Q_5) );
				} else {
					resultado = resultado.add( calculaDesconto(pedido, SEM_CLIENTE_PEDIDO_MENOR_Q_5) );
				}
			}
		}

		return resultado;
	}

	private BigDecimal calculaDesconto(PedidoItem pedido, BigDecimal fator) {
		Produto produto = pedido.getProduto();
		if( produto != null )
			return produto.getPreco().multiply(fator)
				.multiply(new BigDecimal(pedido.getQuantidade()));
		else 
			return BigDecimal.ZERO;
	}

}
