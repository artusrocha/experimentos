package com.example.refactoring;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

public class PedidoServiceImpl4 implements PedidoService {

	public PedidoServiceImpl4(@Autowired ClientService clienteService) {
		super();
		this.clienteService = clienteService;
	}

	private ClientService clienteService;

	public BigDecimal calculaTotal(String cpf, List<PedidoItem> p) {
		BigDecimal resultado = BigDecimal.ZERO;

		Optional<Client> cliente = clienteService.findByCpf(cpf);
		Map<String, BigDecimal> tabelaDesconto = definirTabelaDeDesconto( cliente.isPresent() ) ;
		
		for (int i = 0; i < p.size(); i++) {
			PedidoItem pedido = p.get(i);
			BigDecimal fatorDesconto = definirFatorDeDesconto(pedido.getQuantidade(), tabelaDesconto);
			resultado = resultado.add(calculaDesconto(pedido, fatorDesconto));
		}

		return resultado;
	}

	private Map<String, BigDecimal> definirTabelaDeDesconto(Boolean clientePresent) {
		Map<String, BigDecimal> tabelaDesconto = new HashMap<String, BigDecimal>();
		if ( clientePresent ) {
			tabelaDesconto.put("PEDIDO_MAIOR_Q_5", new BigDecimal("0.9"));
			tabelaDesconto.put("PEDIDO_MENOR_Q_5", new BigDecimal("0.95"));
		} else {
			tabelaDesconto.put("PEDIDO_MAIOR_Q_5", new BigDecimal("0.95"));
			tabelaDesconto.put("PEDIDO_MENOR_Q_5", new BigDecimal("0.98"));
		}
		return tabelaDesconto;
	}
	
	private BigDecimal definirFatorDeDesconto(int quantidade, Map<String, BigDecimal> tabelaDesconto) {
		if (quantidade >= 5)
			return tabelaDesconto.get("PEDIDO_MAIOR_Q_5");
		else
			return tabelaDesconto.get("PEDIDO_MENOR_Q_5");
	}

	private BigDecimal calculaDesconto(PedidoItem pedido, BigDecimal fator) {
		Produto produto = pedido.getProduto();
		if (produto != null)
			return produto.getPreco().multiply(fator).multiply(new BigDecimal(pedido.getQuantidade()));
		else
			return BigDecimal.ZERO;
	}

}
