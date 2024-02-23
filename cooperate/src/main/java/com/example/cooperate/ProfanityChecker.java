package com.example.cooperate;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

public class ProfanityChecker{

    private final int MAXSIZE = 500;
    private final int MAXCHAR = 26;

    private int[][] g = new int[MAXSIZE][MAXCHAR];
    private int[] f = new int[MAXSIZE];
    private int[] out = new int[MAXSIZE];

    private HashSet<String> bannedFullWords;

    private final String MACHINE_FILE = "matchMachine.txt";

    private final String BANNED_SUBWORDS = "banned_subwords.txt";

    private final String BANNED_FULLWORDS = "banned_fullwords.txt";

    public ProfanityChecker() throws FileNotFoundException {
        bannedFullWords = new HashSet<String>();
        File file = new File(BANNED_FULLWORDS);
        Scanner reader = new Scanner(file);

        while(reader.hasNextLine())
        {
            bannedFullWords.add(reader.nextLine());
        }
    }

    public void importMachine() throws FileNotFoundException {
        File file = new File(MACHINE_FILE);
        Scanner reader = new Scanner(file);

        for(int index = 0; index < f.length; index++)
        {
            f[index] = reader.nextInt();
        }
        for(int index = 0; index < out.length; index++)
        {
            out[index] = reader.nextInt();
        }
        for(int i = 0; i < MAXSIZE; i++)
        {
            for(int j = 0; j < MAXCHAR; j++ )
            {
                g[i][j] = reader.nextInt();
            }
        }
    }

    public void exportMachine() throws IOException {
        Path pathMachine = Path.of(MACHINE_FILE);
        for(int i = 0; i < f.length; i++)
        {
            Files.writeString(pathMachine, f[i] + " ");
        }
        for(int i = 0; i < out.length; i++)
        {
            Files.writeString(pathMachine, out[i] + " ");
        }

        for(int i = 0; i < MAXSIZE; i++)
        {
            for(int j = 0; j < MAXCHAR; j++ )
            {
                Files.writeString(pathMachine, "" + g[i][j] + " ");
            }
            Files.writeString(pathMachine, "\n");
        }
    }

    public void buildGoTo() throws FileNotFoundException {

        ArrayList<String> words = new ArrayList<String>();
        File file = new File(BANNED_SUBWORDS);
        Scanner reader = new Scanner(file);

        while(reader.hasNextLine())
        {
            words.addLast(reader.nextLine());
        }
        Arrays.fill(out, 0);
        for(int i = 0; i < MAXSIZE; i++)
        {
            Arrays.fill(g[i], -1);
        }
        int states = -1;

        for(int i = 0; i <words.size(); ++i)
        {
            String word = words.get(i);
            int currentState = 0;

            for(int j = 0; j < words.size(); ++j)
            {
                int ch = word.charAt(j) - 'a';
                if(g[currentState][ch] == -1)
                {
                    g[currentState][ch] = states++;
                }
                currentState = g[currentState][ch];
            }
            out[currentState] |= (1 << i);
        }
        for(int ch = 0; ch < MAXCHAR; ++ch)
        {
            if(g[0][ch] == -1)
            {
                g[0][ch] = 0;
            }
        }
    }

    public void buildFailure()
    {
        Arrays.fill(f, -1);
        Queue<Integer> q = new LinkedList<>();
        for(int ch = 0; ch < MAXCHAR; ++ch)
        {
            if (g[0][ch] != 0)
            {
                f[g[0][ch]] = 0;
                q.add(g[0][ch]);
            }
        }

        while(!q.isEmpty())
        {
            int state = q.remove();
            for(int ch = 0; ch < MAXCHAR; ++ch)
            {
                if (g[state][ch] != -1)
                {
                    int failure = f[state];
                    while(g[failure][ch] == -1)
                    {
                        failure = f[failure];
                    }
                    failure = g[failure][ch];
                    f[g[state][ch]] = failure;

                    out[g[state][ch]] |= out[failure];
                    q.add(g[state][ch]);
                }
            }
        }
    }
    public void buildMachine() throws FileNotFoundException {
        buildGoTo();
        buildFailure();
    }

    public boolean subWordCheck(String text)
    {
        text = text.replace(" ", "");
        int currentState = 0;
        int state;
        for(int i = 0; i < text.length(); ++i)
        {
            int ch = text.charAt(i) - 'a';
            state = currentState;
            while(g[currentState][ch] == -1)
            {
                state = f[state];
            }
            currentState = g[state][ch];
            if (out[currentState]  > 0)
            {
                return true;
            }
        }
        return false;
    }

    public boolean fullWordCheck(String text)
    {
        String[] words = text.split(" ");
        for (int i = 0; i < words.length; i++)
        {
            if (bannedFullWords.contains(words[i]))
            {
                return true;
            }
        }
        return false;
    }

    public boolean check(String text)
    {
        text = text.replaceAll("[^a-z0-9]", "");
        return fullWordCheck(text) | subWordCheck(text);
    }

    public static void main(String[] args) throws FileNotFoundException {
        ProfanityChecker checker = new ProfanityChecker();
        checker.buildMachine();
        boolean prof = checker.check("c r a p");

        System.out.println(prof);
    }

}