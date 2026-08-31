package com.translatorapp.repository;

import com.translatorapp.profile.TranslatorProfile;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TranslatorProfileRepository extends JpaRepository<TranslatorProfile, Long> {
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByPhone(String phone);
}
