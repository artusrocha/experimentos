package br.artus.rabbitmqxp.service;

import java.io.IOException;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import br.artus.rabbitmqxp.config.RabbitMQConfig;
import br.artus.rabbitmqxp.domain.Message;
import br.artus.rabbitmqxp.repository.MessageRepository;

@Component
public class MessageConsumer {

    @Autowired
    private MessageRepository repository;


    ObjectMapper objectMapper = new ObjectMapper();

    private static final Logger logger = LoggerFactory.getLogger(MessageConsumer.class);

    @RabbitListener(queues = {RabbitMQConfig.queueName})
    public void receiveMessage(String messageStr) {
        System.out.println("Msg Str: " + messageStr);
        try {
            persistMessage( objectMapper.readValue(messageStr, Message.class) );
        } catch (IOException e) {
            messageParsingError(messageStr);
        }
    }

    public void messageParsingError(String messageStr) {
        Message message = null;
        try {
            message = new Message( objectMapper.readValue(messageStr, Object.class) );
            System.out.println("Msg Object: " + message);
        } catch (IOException e) {
            System.out.println("Msg Err: " + messageStr);
            message = new Message( messageStr );
        }
        if ( message != null )
            persistMessage(message);
    }

    public void persistMessage(Message message) {
        Message msg = repository.save(message);
    }
}
