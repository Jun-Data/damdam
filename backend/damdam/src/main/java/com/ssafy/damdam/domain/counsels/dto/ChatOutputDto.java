package com.ssafy.damdam.domain.counsels.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 서버 처리 후 서버 → 프론트에 전송할 정보들
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatOutputDto {
	private String sender;
	private String message;
	private LocalDateTime timestamp;
	private Integer tokenCount;
	private int messageOrder;
}
