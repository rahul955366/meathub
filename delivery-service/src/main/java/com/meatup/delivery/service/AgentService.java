package com.meatup.delivery.service;

import com.meatup.delivery.dto.AgentResponse;
import com.meatup.delivery.dto.CreateAgentRequest;
import com.meatup.delivery.entity.DeliveryAgent;
import com.meatup.delivery.exception.AgentAlreadyExistsException;
import com.meatup.delivery.exception.AgentNotFoundException;
import com.meatup.delivery.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentService {

    @Autowired
    private AgentRepository agentRepository;

    @Transactional
    public AgentResponse createAgent(CreateAgentRequest request) {
        // Check if agent with same phone already exists
        if (agentRepository.existsByPhone(request.getPhone())) {
            throw new AgentAlreadyExistsException("Agent with phone " + request.getPhone() + " already exists");
        }

        DeliveryAgent agent = new DeliveryAgent();
        agent.setName(request.getName());
        agent.setPhone(request.getPhone());
        agent.setVehicleType(request.getVehicleType());
        agent.setActive(true);

        DeliveryAgent savedAgent = agentRepository.save(agent);
        return mapToResponse(savedAgent);
    }

    public List<AgentResponse> getAllAgents() {
        return agentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AgentResponse> getActiveAgents() {
        return agentRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DeliveryAgent getAgentById(Long agentId) {
        return agentRepository.findById(agentId)
                .orElseThrow(() -> new AgentNotFoundException("Agent not found with ID: " + agentId));
    }

    private AgentResponse mapToResponse(DeliveryAgent agent) {
        AgentResponse response = new AgentResponse();
        response.setId(agent.getId());
        response.setName(agent.getName());
        response.setPhone(agent.getPhone());
        response.setVehicleType(agent.getVehicleType());
        response.setActive(agent.getActive());
        response.setCreatedAt(agent.getCreatedAt());
        return response;
    }
}
