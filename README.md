# Tic-Tac-Toe

Play it here - https://stephendevaux.github.io/tic-tac-toe/
Built using plain old javascript and Animista for the animations of the player moves.

![alt text](https://github.com/StephenDeVaux/tic-tac-toe/blob/master/images/tictactoe.png?raw=true "Tic Tac Toe")

### 1. How to play
Its a traditional Tic Tac Toe game where first person to have 3 in a row wins. You have 3 choices for each side to play. It can either play as a Human(ie yourself) an easy computer player or a hard computer player. 

### 2. Development
The main part of the development was to get the computer palyer working correctly. I decided to make 2 levels of difficulty. 

**Easy Computer Level** 
This was easy to implement and was a starting point for building the frame work for the entire webpage, with the idea of adding the funciton for hard computer level later on. The easy computer level just generates a random move based on the available moves with no logic to attempt to win. 

**Hard Computer Level** 
Some planning was needed for this. The basic idea is that the best move to proceed with is a solvable problem as the number of possible solutions is sufficiently small to calculate them all. 

The overall logic for this is shown below. From the flow chart it can be seen that the same logic is used to calculate the result of a possible move. It is then reused in each layer of solution solving. Therefore the function will actually call itself within it, and continue to do so until it finds a result, which is the propogated back up until finally each branch of option has a solution. 
![alt text](https://github.com/StephenDeVaux/tic-tac-toe/blob/master/images/OverAllLogic.png?raw=true "Tic Tac Toe")

The logic for the individual function which is then used recursively is shown below: 
![alt text](https://github.com/StephenDeVaux/tic-tac-toe/blob/master/images/FunctionLogic.png?raw=true "Tic Tac Toe")
 
### 3. Problems

### 4. Challenges

### 5. Lessons
