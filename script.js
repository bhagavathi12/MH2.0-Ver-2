//getting user inputs
const player1 = document.getElementById('player1')
const player2 = document.getElementById('player2')
const start = document.getElementById('startgame')
const userinputdiv = document.getElementById('userinput')
const next = document.getElementById('next')
const result = document.getElementById('resultbtn')
const refresh = document.getElementById('refresh')

const categorydiv = document.getElementById('category')
categorydiv.classList.add('hide')
const selectlist = document.getElementById('category-list')
const questiondiv = document.getElementById('question')
const answerdiv = document.createElement('div')
const resultdiv = document.getElementById('result')
resultdiv.classList.add('hide')

const easy = []
const medium = []
const hard = []

let currentQuestionIndex = 0;
let overallquizquestions = []
let selectedCategory = []

let player1_score = 0
let player2_score = 0
let currentPlayer;

//api call to fetch the categories
const fetchCategory = async() => {
    const response = await fetch('https://the-trivia-api.com/v2/categories')
    const category = await response.json()
    return category
}

//category dropdown menu
const displayCategory = async(e) => {
    e.preventDefault()
    if(player1.value && player2.value)
    {
        currentPlayer = player1.value;
        currentQuestionIndex = 0
        overallquizquestions = []
        userinputdiv.classList.add('hide')
        categorydiv.classList.add('categorydiv')
        const category = await fetchCategory()
        const categorylist = Object.keys(category)
        for(let i=0;i<categorylist.length;i++){
            const dropdown = document.createElement('option')
            dropdown.value = categorylist[i]
            dropdown.text = categorylist[i]
            selectlist.appendChild(dropdown)
        }
    }
    else{
        alert('Please enter input fields')
    }
}

// fetch the questions based on category
const fetchQuestions = async(cat) => {
    if(selectedCategory.includes(cat)){
        alert("You already finished this category. Please select another category.")
    }
    else
    {
        resultdiv.classList.remove('resultdiv')
        questiondiv.classList.remove('questiondiv')
        questiondiv.innerHTML = ''
        result.classList.remove('resultbtn')
        refresh.classList.remove('refreshbtn')
        currentPlayer = player1.value
        player1_score = 0
        player2_score = 0

        const response = await fetch(`https://the-trivia-api.com/api/questions?limit=50&categories=${cat}`) 
        const questions = await response.json()
        if(questions){
            selectedCategory.push(cat)
            filterQuestions(questions)
        }
    }
}

//filter the question array based on difficulty levels.
const filterQuestions = (questions) => {
   questions.forEach((ques)=> {
    if(ques.difficulty === 'easy'){
        easy.push(ques);   
    }
    else if(ques.difficulty === 'medium'){
        medium.push(ques);
    }
    else{
        hard.push(ques);
    }
   })
   //shuffling and slicing the questions arrays to get a 6 questions single array.
   overallquizquestions = [...(shuffleArray(easy)).slice(0,2),...(shuffleArray(medium)).slice(0,2),...(shuffleArray(hard)).slice(0,2)]
   next.classList.add('next-btn')
}

//shuffle an array
const shuffleArray = (arr) => {
    for (let i=arr.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j],arr[i]]
    }
    return arr
}

// next button function call - to display the question.
const displayQuestion = () => {

    categorydiv.classList.remove('categorydiv')
    resultdiv.classList.remove('resultdiv')
    result.classList.remove('resultbtn')
    refresh.classList.remove('refreshbtn')
    if(currentQuestionIndex<overallquizquestions.length)
    {
        questiondiv.innerHTML = ''
        answerdiv.innerHTML = ''
        //function call to append questions on the ui
        AppendQuestions(overallquizquestions[currentQuestionIndex])
        currentQuestionIndex++
    }
    else
    {  
        
        questiondiv.innerHTML = '';
        currentQuestionIndex = 0;
        const display = document.createElement('h2');
        display.textContent = 'You are finished the quiz for this category.Choose another category if you wish to play again!! Click on results button to know your scores';
        const selectedcategorydiv = document.createElement('div');
        const categorylist = document.createElement('h4')
        categorylist.textContent = `Selected Category list: ${selectedCategory.join(',')}`
        selectedcategorydiv.appendChild(categorylist)
        questiondiv.appendChild(display);
        questiondiv.appendChild(selectedcategorydiv);
        categorydiv.classList.add('categorydiv');
        result.classList.add('resultbtn')
        refresh.classList.add('refreshbtn')
        next.classList.remove('next-btn')
        overallquizquestions = []
    }
    
}

//result button function call to display the results.
const displayResult = () => {
        resultdiv.innerHTML = ''
        resultdiv.classList.add('resultdiv')
        const player1result = document.createElement('p')
        player1result.textContent = `${player1.value}'s score: ${player1_score}`
        const player2result = document.createElement('p')
        player2result.textContent = `${player2.value}'s score: ${player2_score}`
        resultdiv.appendChild(player1result)
        resultdiv.appendChild(player2result)

}
//answer button function call - to check answers, switch player's turn.
const checkAnswer = (ans,ques) => 
    {
        if(ans === ques.correctAnswer){
            //update the player's score for the correct answer.
            scoreUpdate(ques)
        }
        Array.from(answerdiv.children).forEach((btn)=> {
            if(btn.textContent !== ques.correctAnswer)
            {
                btn.classList.add('wrongans');
            }
            else
            {
                btn.classList.add('correctans');
                
            }
        })
        const allBtn = document.querySelectorAll('.btn');
        allBtn.forEach((info) => {
            info.disabled = true;
        });
        ((currentPlayer === player1.value)?(currentPlayer=player2.value):(currentPlayer=player1.value));
    }
    
// function call for score update.
const scoreUpdate = (ques) => {
    if(ques.difficulty === 'easy')
    {
        if(currentPlayer === player1.value)
        {
            player1_score = player1_score + 10;
        }
        else{
            player2_score = player2_score + 10
        }
    }
    else if(ques.difficulty === 'medium')
    {
        if(currentPlayer === player1.value)
        {
            player1_score = player1_score + 15
        }
        else{
            player2_score = player2_score + 15
        }
    }
    else
    {
        if(currentPlayer === player1.value)
        {
            player1_score = player1_score + 20
        }
        else
        {
            player2_score = player2_score + 20
        }
    }   
}

//to append the questions on the ui - display questions.
const AppendQuestions = (ques) => {
        const playerturn =  document.createElement('h3')
        playerturn.innerHTML = `${currentPlayer}'s turn`
        questiondiv.classList.add('questiondiv')
        const question = document.createElement('h3')
        question.textContent = ques.question
        questiondiv.appendChild(playerturn)
        questiondiv.appendChild(question)
        answerdiv.classList.add('answerdiv')
    
        const answer = shuffleArray([ques.correctAnswer,...ques.incorrectAnswers])
        console.log(answer)
        answer.forEach((ans)=> {
            const option = document.createElement('button') 
            option.addEventListener('click',()=>checkAnswer(ans,ques))
            option.innerText = ans
            option.classList.add('btn')
            answerdiv.appendChild(option)          
        })
        questiondiv.appendChild(answerdiv)
    }

const restartQuiz = () => {
    location.reload();
}

//start button - to fetch the categories
start.addEventListener('click',displayCategory)
//on change event listeners - to fetch the questions. 
selectlist.addEventListener('change',()=>fetchQuestions(selectlist.value))
//display the questions on the ui
next.addEventListener('click',displayQuestion)
//to display the results.
result.addEventListener('click',displayResult)
//exit or restart the game
refresh.addEventListener('click',restartQuiz)

