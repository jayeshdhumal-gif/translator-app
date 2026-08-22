package com.translatorapp.service;

import com.translatorapp.profile.TranslatorProfile;
import com.translatorapp.repository.TranslatorProfileRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TranslatorProfileService {

    private final TranslatorProfileRepository repository;

    public TranslatorProfileService(TranslatorProfileRepository repository) {
        this.repository = repository;
    }

    public TranslatorProfile createProfile(@NonNull TranslatorProfile profile) {
        return repository.save(profile);
    }

    public List<TranslatorProfile> getProfiles() {
        return repository.findAll();
    }
}
