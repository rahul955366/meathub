package com.meathub.butcher.controller;

import com.meathub.butcher.dto.ApprovalRequest;
import com.meathub.butcher.dto.ButcherResponse;
import com.meathub.butcher.service.ButcherService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/butchers/admin")
public class AdminController {

    @Autowired
    private ButcherService butcherService;

    @GetMapping
    public ResponseEntity<List<ButcherResponse>> getAllButchers() {
        List<ButcherResponse> butchers = butcherService.getAllButchers();
        return ResponseEntity.ok(butchers);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ButcherResponse> approveButcher(@PathVariable Long id) {
        ButcherResponse response = butcherService.approveButcher(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<ButcherResponse> rejectButcher(
            @PathVariable Long id,
            @Valid @RequestBody ApprovalRequest request) {
        ButcherResponse response = butcherService.rejectButcher(id, request.getReason());
        return ResponseEntity.ok(response);
    }
}
