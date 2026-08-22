package com.translatorapp.profile;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class TranslatorProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createsAndListsTranslatorProfiles() throws Exception {
        Map<String, Object> profile = Map.of(
                "name", "Anika Sharma",
                "email", "anika@example.com",
                "phone", "+91 9876543210",
                "city", "Jaipur",
                "languages", new String[]{"Hindi", "English", "French"},
                "bio", "Local translator and cultural guide.",
                "hourlyRate", 20.00
        );

        mockMvc.perform(post("/api/profiles")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profile)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNumber())
                .andExpect(jsonPath("$.name").value("Anika Sharma"));

        mockMvc.perform(get("/api/profiles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].city").value("Jaipur"))
                .andExpect(jsonPath("$[0].languages[2]").value("French"));
    }

    @Test
    void rejectsProfileWithoutRequiredFields() throws Exception {
        mockMvc.perform(post("/api/profiles")
                        .contentType(APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Request validation failed"))
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.languages").exists());
    }
}
