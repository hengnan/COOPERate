package com.example.cooperate;

import java.util.HashSet;
import java.util.Set;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class ProfanityFilter {
    private Set<String> badWords;

    private static final Pattern WORD_SPLIT_PATTERN = Pattern.compile("[\\s\\p{Punct}]+");

    public ProfanityFilter() {
        badWords = new HashSet<>();
    }

    // Method to add a single bad word to the filter
    public void addBadWord(String word) {
        badWords.add(word.toLowerCase());
    }

    // Method to add multiple bad words to the filter
    public void addBadWords(String[] words) {
        for (String word : words) {
            addBadWord(word);
        }
    }

    // Method to check if a given word is profane
    public boolean containsProfanity(String input) {
        String[] words = input.toLowerCase().split("\\s+");
        for (String word : words) {
            if (badWords.contains(word)) {
                return true;
            }
        }
        return false;
    }

    // Method to filter out profane words from a given input string
    public String filterProfanity(String input) {
        String[] words = input.split("\\s+");
        StringBuilder filteredText = new StringBuilder();

        for (String word : words) {
            // Separate punctuation from the word
            String[] separatedWords = word.split("(?<=\\p{Punct})|(?=\\p{Punct})");

            for (String separatedWord : separatedWords) {
                if (!separatedWord.matches("\\p{Punct}")) {
                    // Filter out profane words
                    if (badWords.contains(separatedWord.toLowerCase())) {
                        filteredText.append(replaceChars(separatedWord));
                    } else {
                        filteredText.append(separatedWord);
                    }
                } else {
                    // Preserve punctuation
                    filteredText.append(separatedWord);
                }
            }
            // Add a space after each word
            filteredText.append(" ");
        }

        return filteredText.toString().trim();
    }


    // Helper method to replace characters in a profane word with *
    private String replaceChars(String word) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < word.length(); i++) {
            sb.append("*");
        }
        return sb.toString();
    }

    public static ProfanityFilter loadBadWordsFromFile(String csvFilePath) {

        ProfanityFilter filter = new ProfanityFilter();
        List<String> badWordsList = new ArrayList<>();

        try (BufferedReader br = new BufferedReader(new FileReader(csvFilePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] words = line.trim().split("\\s+");
                for (String word : words) {
                    badWordsList.add(word.trim());
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        String[] badWords = badWordsList.toArray(new String[0]);
        filter.addBadWords(badWords);
        return filter;
    }

}
