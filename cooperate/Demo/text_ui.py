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
    

def getReviews():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(text + "\n\n")
    while(True):
        source = input("Would you like to see the reviews associated with a user, professor, or course? ")
        if source  in ["user", "professor", "course"]:
            source += "_id"
            break
        else:
            print("Invalid argument! Please try again")
    
    print("\n")
    while(True):
        id=  input("Please enter the id of the " + source[:-3] + " whose reviews you would like to see: ")
        if id.isdigit():
            break
        else:
            print("ID must be an integer! Please try again")

    print("\n")
    while(True):
        ordered_by = input("Press L or T to sort the reviews by their netlikes and the time they were created respectively: ")

        if ordered_by == "L":
            ordered_by = "netlikes"
            break
        elif ordered_by == "T":
            ordered_by = "timestamp"
            break
        else:
            print("Invalid argument! Please try again")
    
    while(True):
        order = input("Press A to see the reviews in ascending order or D to see them in descending order: ")
        if order == "A":
            order = "ASC"
            break
        elif order == "D":
            order = "DESC"
            break
        else:
            print("Invalid argument! Please try again")
    
    pagenum = 0

    
    while(True):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(text + "\n\n")
        url = "http://localhost:8080/" + source + "/" + id + "/" + ordered_by + "/" + order + "/" + str(pagenum)

        info = requests.get(url).json()

        print(info)
        action = input("Press l or r to move to the previous or next page. Additionally, you can enter a number to jump to a page as well. If you would like to return to the home page, please press enter")

        match action:
            case "l":
                pagenum -=1
            case "r":
                pagenum += 1
            case "":
                break
            case _:
                if action.isdigit() and int(action) >= 0:
                    pagenum = int(action)
                else:
                    print("Invalid argument! Please try again")
                    time.sleep(2)







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
        print("\t4.Make a review")
        print("\t5.Search for a course")
        print("\t6.Search for a user")
        print("\t7.Search for a professor")
        print("\t8.Exit")

        action = input("\nPlease enter a number from 1-6 corresponding to the action you would like to perform: ")

        printLines = 11
        match action:
            case "1":
                print("\nI see that you want to make an account")
            case "2":
                getReviews()
            case "3":
                print("\nI see that you want to like a review")
            case "4":
                print("\nI see that you want to make a review")
            case "5":
                getInfo("Courses")
            case "6":
                getInfo("Users")
            case "7":
                getInfo("Professors")
            case "8":
                print("\nGoodbye!")
                exit
            case _:
                print("\nUh-oh it looks like you entered an invalid argument :(. Please try again")
                time.sleep(2)
        
        

