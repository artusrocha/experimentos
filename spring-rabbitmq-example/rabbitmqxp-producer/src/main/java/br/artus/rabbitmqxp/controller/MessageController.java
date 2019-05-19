package br.artus.rabbitmqxp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import br.artus.rabbitmqxp.domain.Message;
import br.artus.rabbitmqxp.service.MessageProducer;

@RestController
public class MessageController {

    private final MessageProducer messageProducer;

    @Autowired
    public MessageController(MessageProducer messageProducer) {
        this.messageProducer = messageProducer;
    }

    @RequestMapping(value="/message/str", method= RequestMethod.POST)
    @ResponseStatus(value= HttpStatus.CREATED)
    public void sendMessage(@RequestBody String message) {
        System.out.println(message);
        messageProducer.sendMessage(message);
    }

    @RequestMapping(value="/messages", method= RequestMethod.POST)
    @ResponseStatus(value= HttpStatus.CREATED)
    public void sendMessages(@RequestBody List<String> messages) {
        messages.forEach( message -> {
            System.out.println(message);
            messageProducer.sendMessage(message);
        });
    }

    @RequestMapping(value="/message", method= RequestMethod.POST)
    @ResponseStatus(value= HttpStatus.CREATED)
    public void sendMessage(@RequestBody Message message) {
        System.out.println(message);
        messageProducer.sendMessage(message);
    }
}
