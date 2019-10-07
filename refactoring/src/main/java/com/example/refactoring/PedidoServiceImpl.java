package com.example.refactoring;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

public class PedidoServiceImpl implements PedidoService {

	public PedidoServiceImpl(@Autowired ClientService cService) {
		super();
		this.cService = cService;
	}

	private ClientService cService;

	public BigDecimal calT(String code, List<PedidoItem> p) {
		BigDecimal r = BigDecimal.ZERO;

		Optional<Client> c = cService.findByCpf(code);
		boolean c3;
		try {
			Client c2 = c.get();
			c3 = true;
		} catch (Exception e) {
			c3 = false;
		}

		for (int i = 0; i < p.size(); i++) {
			PedidoItem p2 = p.get(i);
			Produto p3 = p2.getProduto();
			if (p2.getQuantidade() >= 5) {
				if (c3 == true) {
					r = r.add(p3.getPreco().multiply(new BigDecimal("0.9"))
							.multiply(new BigDecimal(p2.getQuantidade())));
				} else {
					r = r.add(p3.getPreco().multiply(new BigDecimal("0.95"))
							.multiply(new BigDecimal(p2.getQuantidade())));
				}
			} else {
				if (c3 == true) {
					r = r.add(p3.getPreco().multiply(new BigDecimal("0.95"))
							.multiply(new BigDecimal(p2.getQuantidade())));
				} else {
					r = r.add(p3.getPreco().multiply(new BigDecimal("0.98"))
							.multiply(new BigDecimal(p2.getQuantidade())));
				}
			}
		}

		return r;
	}

}
