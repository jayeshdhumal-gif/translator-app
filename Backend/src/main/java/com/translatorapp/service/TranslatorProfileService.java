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
        String normalizedEmail = normalizeEmail(profile.getEmail());
        if (normalizedEmail != null && repository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new RuntimeException("A profile with this email already exists");
        }

        String normalizedPhone = normalizePhone(profile.getPhone());
        if (normalizedPhone != null && repository.existsByPhone(normalizedPhone)) {
            throw new RuntimeException("A profile with this phone number already exists");
        }

        profile.setEmail(normalizedEmail);
        profile.setPhone(normalizedPhone);
        return repository.save(profile);
    }

    public List<TranslatorProfile> getProfiles() {
        return repository.findAll();
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        String value = email.trim();
        return value.isEmpty() ? null : value;
    }

    private String normalizePhone(String phone) {
        if (phone == null) {
            return null;
        }

        String value = phone.replaceAll("[\\s\\-()]+", "").trim();
        return value.isEmpty() ? null : value;
    }
}
