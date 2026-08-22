package com.translatorapp.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.translatorapp.profile.TranslatorProfile;
import com.translatorapp.service.TranslatorProfileService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5500",
    "http://127.0.0.1:5500"
})
public class TranslatorProfileController {

    private final TranslatorProfileService service;

    public TranslatorProfileController(TranslatorProfileService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TranslatorProfile createProfile(@Valid @RequestBody TranslatorProfile profile) {
        return service.createProfile(profile);
    }

    @GetMapping
    public List<TranslatorProfile> getProfiles() {
        return service.getProfiles();
    }
}
