import requests
import os
import sys
import time

with open("logo.txt", "r") as f:
        text = f.read()


def getInfo(obj):
    os.system('cls' if os.name == 'nt' else 'clear')
    print(text + "\n\n")

    id = ""

    while(True):
        id = input("Please enter the ID of the "  + obj.lower()[:-1]  + " that you would like to search for: ")
        if id.isdigit():
            break
        else:
            print("ID must be an integer! Please try again")

    url = "http://localhost:8080/" + obj + "/" +  id
    info = requests.get(url).json()

    for field in info.keys():
        print(field + ": " + str(info[field]))

    print("\n")
    input("Here's the " + obj.lower()[:-1] + "'s " + "information. Press Enter when you're ready to return to the home page")
    

if __name__ == "__main__":

    while(True):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(text)
        print("\n*****Fakharyar Khan*****")
        print("*****Nicholas Singh*****")
        print("*****Irene Choi*********")
        print("*****Hengnan Ma*********")
    
        print("\n\n**********Welcome to Cooperate**********\n\n")
        print("This is a service that allows Cooper Union students to anonymously")
        print("post reviews on courses and professors that they have had as well")
        print("as upload helpful documents such as syllabi and past exams.\n")



        print("What would you like to do?")
        print("\n\t1.Create an account")
        print("\t2.Look at reviews")
        print("\t3.Like a review")
        print("\t4.Search for a course")
        print("\t5.Search for a user")
        print("\t6.Search for a professor")
        print("\t7.Exit")

        action = input("\nPlease enter a number from 1-6 corresponding to the action you would like to perform: ")

        printLines = 11
        match action:
            case "1":
                print("\nI see that you want to make an account")
            case "2":
                print("\nI see that you want to look at reviews")
            case "3":
                print("\nI see that you want to like a review")
            case "4":
                getInfo("Courses")
            case "5":
                getInfo("Users")
            case "6":
                getInfo("Professors")
            case "7":
                print("\nGoodbye!")
                exit
            case _:
                print("\nUh-oh it looks like you entered an invalid argument :(. Please try again")
                time.sleep(2)
        
        

