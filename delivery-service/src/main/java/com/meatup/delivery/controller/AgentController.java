package com.meatup.delivery.controller;

import com.meatup.delivery.dto.AgentResponse;
import com.meatup.delivery.dto.CreateAgentRequest;
import com.meatup.delivery.service.AgentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/agents")
public class AgentController {

    @Autowired
    private AgentService agentService;

    @PostMapping
    public ResponseEntity<AgentResponse> createAgent(@Valid @RequestBody CreateAgentRequest request) {
        AgentResponse response = agentService.createAgent(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<AgentResponse>> getAllAgents() {
        List<AgentResponse> agents = agentService.getAllAgents();
        return ResponseEntity.ok(agents);
    }
}
