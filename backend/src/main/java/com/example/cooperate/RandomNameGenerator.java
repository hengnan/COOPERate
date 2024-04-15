package com.example.cooperate;
import java.util.Random;

public class RandomNameGenerator {
    private static final String[] ADJECTIVES = {"Brave", "Smart", "Happy", "Kind", "Wise", "Clever", "Gentle", "Loyal"};
    private static final String[] NOUNS = {"Fox", "Wolf", "Tiger", "Bear", "Lion", "Eagle", "Dolphin", "Owl"};

    public static String generateRandomUsername() {
        Random random = new Random();
        int adjectiveIndex = random.nextInt(ADJECTIVES.length);
        int nounIndex = random.nextInt(NOUNS.length);
        return ADJECTIVES[adjectiveIndex] + NOUNS[nounIndex];
    }
}