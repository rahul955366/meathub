package com.meatup.delivery.service;

import com.meatup.delivery.dto.AssignDeliveryRequest;
import com.meatup.delivery.dto.DeliveryResponse;
import com.meatup.delivery.dto.DeliveryStatusUpdateRequest;
import com.meatup.delivery.entity.Delivery;
import com.meatup.delivery.entity.DeliveryAgent;
import com.meatup.delivery.exception.DeliveryAlreadyAssignedException;
import com.meatup.delivery.exception.DeliveryNotFoundException;
import com.meatup.delivery.exception.InvalidStatusTransitionException;
import com.meatup.delivery.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DeliveryService {

    @Autowired
    private DeliveryRepository deliveryRepository;

    @Autowired
    private AgentService agentService;

    @Transactional
    public DeliveryResponse assignDelivery(AssignDeliveryRequest request) {
        // Check if delivery already assigned
        if (deliveryRepository.existsByOrderId(request.getOrderId())) {
            throw new DeliveryAlreadyAssignedException("Delivery already assigned for order: " + request.getOrderId());
        }

        // Verify agent exists
        DeliveryAgent agent = agentService.getAgentById(request.getAgentId());

        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setAgentId(request.getAgentId());
        delivery.setStatus(Delivery.DeliveryStatus.ASSIGNED);

        Delivery savedDelivery = deliveryRepository.save(delivery);
        return mapToResponse(savedDelivery, agent);
    }

    @Transactional
    public DeliveryResponse updateDeliveryStatus(Long deliveryId, DeliveryStatusUpdateRequest request) {
        Delivery delivery = deliveryRepository.findById(deliveryId)
                .orElseThrow(() -> new DeliveryNotFoundException("Delivery not found"));

        // Validate status transition
        if (!delivery.canUpdateStatus(request.getStatus())) {
            throw new InvalidStatusTransitionException(
                    "Cannot change status from " + delivery.getStatus() + " to " + request.getStatus());
        }

        // Check failure reason requirement
        if (request.getStatus() == Delivery.DeliveryStatus.FAILED) {
            if (request.getFailureReason() == null || request.getFailureReason().trim().isEmpty()) {
                throw new IllegalArgumentException("Failure reason is required when marking as FAILED");
            }
            delivery.setFailureReason(request.getFailureReason());
            delivery.setFailedAt(LocalDateTime.now());
        }

        // Update status and timestamps
        delivery.setStatus(request.getStatus());

        if (request.getStatus() == Delivery.DeliveryStatus.OUT_FOR_DELIVERY) {
            delivery.setPickedUpAt(LocalDateTime.now());
        } else if (request.getStatus() == Delivery.DeliveryStatus.DELIVERED) {
            delivery.setDeliveredAt(LocalDateTime.now());
        }

        Delivery savedDelivery = deliveryRepository.save(delivery);
        DeliveryAgent agent = agentService.getAgentById(savedDelivery.getAgentId());
        return mapToResponse(savedDelivery, agent);
    }

    public List<DeliveryResponse> getAgentDeliveries(Long agentId) {
        List<Delivery> deliveries = deliveryRepository.findByAgentIdOrderByAssignedAtDesc(agentId);
        return deliveries.stream()
                .map(delivery -> {
                    DeliveryAgent agent = agentService.getAgentById(delivery.getAgentId());
                    return mapToResponse(delivery, agent);
                })
                .collect(Collectors.toList());
    }

    public DeliveryResponse getDeliveryByOrderId(Long orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new DeliveryNotFoundException("Delivery not found for order: " + orderId));

        DeliveryAgent agent = agentService.getAgentById(delivery.getAgentId());
        return mapToResponse(delivery, agent);
    }

    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAllByOrderByAssignedAtDesc().stream()
                .map(delivery -> {
                    DeliveryAgent agent = agentService.getAgentById(delivery.getAgentId());
                    return mapToResponse(delivery, agent);
                })
                .collect(Collectors.toList());
    }

    private DeliveryResponse mapToResponse(Delivery delivery, DeliveryAgent agent) {
        DeliveryResponse response = new DeliveryResponse();
        response.setId(delivery.getId());
        response.setOrderId(delivery.getOrderId());
        response.setAgentId(delivery.getAgentId());
        response.setAgentName(agent.getName());
        response.setAgentPhone(agent.getPhone());
        response.setStatus(delivery.getStatus());
        response.setFailureReason(delivery.getFailureReason());
        response.setAssignedAt(delivery.getAssignedAt());
        response.setUpdatedAt(delivery.getUpdatedAt());
        response.setPickedUpAt(delivery.getPickedUpAt());
        response.setDeliveredAt(delivery.getDeliveredAt());
        response.setFailedAt(delivery.getFailedAt());
        return response;
    }
}
