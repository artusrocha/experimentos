package br.artus.rabbitmqxp.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import br.artus.rabbitmqxp.domain.Message;

public interface MessageRepository extends MongoRepository<Message, String> {
}