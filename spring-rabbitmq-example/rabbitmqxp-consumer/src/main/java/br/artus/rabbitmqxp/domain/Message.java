package br.artus.rabbitmqxp.domain;

import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
 
@Document(collection = "message")
public class Message {

// @Id
// private UUID id = UUID.randomUUID();
 
 @Id
 private String key;

 private String value;

 private Object unknown;

 private Error error;

 public Message() { 
 }

 public Message(Object messageObj) { 
  unknown = messageObj;
  error = Error.UNKNOWN;
 }

 public Message(String messageStr) {
  unknown = messageStr;
  error = Error.UNPARSEABLE;
 }

 public String getKey() {
  return key;
 }

 public void setKey(String key) {
  this.key = key;
 }

 public String getValue() {
  return value;
 }

 public void setValue(String value) {
  this.value = value;
 }

 public Object getUnknown() {
  return unknown;
 }

 public Error getError() {
  return error;
 }

}