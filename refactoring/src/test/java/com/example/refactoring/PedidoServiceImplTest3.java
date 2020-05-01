package com.example.refactoring;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.Before;
import org.junit.Test;

public class PedidoServiceImplTest3 {

	ClientService clientServiceMock = mock(ClientService.class);
	PedidoServiceImpl3 target;

	@Before
	public void setup() {
		String cpf = "000.000.000-00";
		when(clientServiceMock.findByCpf(cpf)).thenReturn(Optional.of(new Client()));
		target = new PedidoServiceImpl3(clientServiceMock);
	}

	@Test
	public void testCalculaTotal_Client_1_per_item() {
		String cpf = "000.000.000-00";
		BigDecimal result_1_per_item = target.calculaTotal(cpf, getProdutosPedidos(1));
		assertEquals(new BigDecimal("1.90"), result_1_per_item);
	}

	@Test
	public void testCalculaTotal_NoClient_1_per_item() {
		String cpf = "";
		BigDecimal result_1_per_item = target.calculaTotal(cpf, getProdutosPedidos(1));
		assertEquals(new BigDecimal("1.96"), result_1_per_item);
	}
	
	@Test
	public void testCalculaTotal_Client_5_per_item() {
		String cpf = "000.000.000-00";
		BigDecimal result_5_per_item = target.calculaTotal(cpf, getProdutosPedidos(5));
		assertEquals(new BigDecimal("9.0"), result_5_per_item);
	}

	@Test
	public void testCalculaTotal_NoClient_5_per_item() {
		String cpf = "";
		BigDecimal result_5_per_item = target.calculaTotal(cpf, getProdutosPedidos(5));
		assertEquals(new BigDecimal("9.50"), result_5_per_item);
	}

	private List<PedidoItem> getProdutosPedidos(Integer quantidade) {
		List<PedidoItem> listaProdutosPedidos = new ArrayList<PedidoItem>();
		listaProdutosPedidos.add(new PedidoItem(quantidade, new Produto(BigDecimal.ONE)));
		listaProdutosPedidos.add(new PedidoItem(quantidade, new Produto(BigDecimal.ONE)));
		return listaProdutosPedidos;
	}
}
