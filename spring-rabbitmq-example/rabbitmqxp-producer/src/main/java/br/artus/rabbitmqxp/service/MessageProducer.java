package br.artus.rabbitmqxp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.artus.rabbitmqxp.config.RabbitMQConfig;
import br.artus.rabbitmqxp.domain.Message;

@Component
public class MessageProducer {

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public MessageProducer(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void sendMessage(String messageStr) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.queueName, messageStr);
    }

    public void sendMessage(Message message) {
        try {
            sendMessage( objectMapper.writeValueAsString(message) );
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
		}
    }
}
