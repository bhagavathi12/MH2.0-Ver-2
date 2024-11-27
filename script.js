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


const fetchCategory = async() => {
    const response = await fetch('https://the-trivia-api.com/v2/categories')
    const category = await response.json()
    console.log(category)
    return category
}

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
            console.log(categorylist[i])
            dropdown.value = categorylist[i]
            dropdown.text = categorylist[i]
            selectlist.appendChild(dropdown)
        }
    }
    else{
        alert('Please enter input fields')
    }
}

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
        console.log(questions)
        console.log(questions.length)
        if(questions){
            selectedCategory.push(cat)
            filterQuestions(questions)
        }
    }
}

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
   overallquizquestions = [...(shuffleArray(easy)).slice(0,2),...(shuffleArray(medium)).slice(0,2),...(shuffleArray(hard)).slice(0,2)]
   next.classList.add('next-btn')
}

const shuffleArray = (arr) => {
    for (let i=arr.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        [arr[i],arr[j]] = [arr[j],arr[i]]
    }
    return arr
}


const displayQuestion = () => {

    categorydiv.classList.remove('categorydiv')
    resultdiv.classList.remove('resultdiv')
    result.classList.remove('resultbtn')
    refresh.classList.remove('refreshbtn')
    console.log(currentQuestionIndex)
    if(currentQuestionIndex<overallquizquestions.length)
    {
        questiondiv.innerHTML = ''
        answerdiv.innerHTML = ''
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
const checkAnswer = (ans,ques) => 
    {
        if(ans === ques.correctAnswer){
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
        console.log(allBtn);
        allBtn.forEach((info) => {
            info.disabled = true;
        });
        ((currentPlayer === player1.value)?(currentPlayer=player2.value):(currentPlayer=player1.value));
    }
    


const scoreUpdate = (ques) => {
    if(ques.difficulty === 'easy')
    {
        if(currentPlayer === player1.value)
        {
            player1_score = player1_score + 10;
            console.log('player1score updated')
        }
        else{
            player2_score = player2_score + 10
            console.log('player2score updated')
        }
    }
    else if(ques.difficulty === 'medium')
    {
        if(currentPlayer === player1.value)
        {
            player1_score = player1_score + 15
            console.log('player1score updated')
        }
        else{
            player2_score = player2_score + 15
            console.log('player2score updated')
        }
    }
    else
    {
        if(currentPlayer === player1.value)
        {
            player1_score = player1_score + 20
            console.log('player1score updated')
        }
        else
        {
            player2_score = player2_score + 20
            console.log('player1score updated')
        }
    }   
}

const AppendQuestions = (ques) => {
        const playerturn =  document.createElement('h3')
        playerturn.innerHTML = `${currentPlayer}'s turn`
        questiondiv.classList.add('questiondiv')
        const question = document.createElement('h3')
        question.textContent = ques.question
        questiondiv.appendChild(playerturn)
        questiondiv.appendChild(question)
        answerdiv.classList.add('answerdiv')
        console.log(overallquizquestions)
    
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

start.addEventListener('click',displayCategory)
next.addEventListener('click',displayQuestion)
result.addEventListener('click',displayResult)
refresh.addEventListener('click',restartQuiz)
selectlist.addEventListener('change',()=>fetchQuestions(selectlist.value))
