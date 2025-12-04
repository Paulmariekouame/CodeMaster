// Animation au scroll
// @ts-nocheck
        const animateElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        animateElements.forEach(el => observer.observe(el));
        
        // Header scroll effect
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // Données des quiz (gardées identiques à l'original)
        const quizzes = {
            'cyber-beginner': {
                title: 'Hacking Éthique - Niveau Débutant',
                category: 'Cybersécurité',
                questions: [
                    {
                        question: "Qu'est-ce que le phishing ?",
                        options: [
                            "Une attaque par déni de service",
                            "Une technique de social engineering pour voler des informations",
                            "Un type de virus informatique",
                            "Une faille de sécurité réseau"
                        ],
                        correct: 1
                    },
                    {
                        question: "Quel est le but principal d'un test d'intrusion ?",
                        options: [
                            "Pirater des systèmes illégalement",
                            "Tester la sécurité d'un système avec autorisation",
                            "Créer des backdoors",
                            "Voler des données"
                        ],
                        correct: 1
                    },
                    {
                        question: "Qu'est-ce qu'un malware ?",
                        options: [
                            "Un logiciel de sécurité",
                            "Un logiciel malveillant",
                            "Un type de pare-feu",
                            "Un protocole réseau"
                        ],
                        correct: 1
                    },
                    {
                        question: "Quelle est la différence entre white hat et black hat ?",
                        options: [
                            "Le type de chapeau qu'ils portent",
                            "White hat = éthique, Black hat = malveillant",
                            "Le niveau d'expertise",
                            "La spécialisation technique"
                        ],
                        correct: 1
                    }
                ]
            },
            'js-basics': {
                title: 'JavaScript - Les Bases',
                category: 'Développement',
                questions: [
                    {
                        question: "Comment déclarer une variable en JavaScript ?",
                        options: [
                            "variable x = 5;",
                            "let x = 5;",
                            "x := 5;",
                            "x = 5;"
                        ],
                        correct: 1
                    },
                    {
                        question: "Quelle méthode utilise-t-on pour afficher dans la console ?",
                        options: [
                            "print()",
                            "console.log()",
                            "display()",
                            "log()"
                        ],
                        correct: 1
                    }
                ]
            },
            'tcp-ip': {
                title: 'Réseaux TCP/IP',
                category: 'Réseaux',
                questions: [
                    {
                        question: "Quel est le port par défaut du HTTP ?",
                        options: ["80", "443", "21", "25"],
                        correct: 0
                    },
                    {
                        question: "Quelle couche du modèle TCP/IP gère le routage ?",
                        options: ["Application", "Transport", "Internet", "Liaison"],
                        correct: 2
                    }
                ]
            }
        };

        // Variables du quiz (gardées identiques)
        let currentQuiz = null;
        let currentQuestionIndex = 0;
        let score = 0;
        let userAnswers = [];

        // Démarrer un quiz
        function startQuiz(quizId) {
            currentQuiz = quizzes[quizId];
            currentQuestionIndex = 0;
            score = 0;
            userAnswers = [];
            
            // Masquer la grille des quiz
            document.querySelector('.quiz-grid').style.display = 'none';
            document.querySelector('.section-title').style.display = 'none';
            document.querySelector('.quiz-stats').style.display = 'none';
            
            // Afficher le quiz actif
            const activeQuiz = document.getElementById('activeQuiz');
            activeQuiz.style.display = 'block';
            
            // Afficher la première question
            showQuestion();
        }

        // Afficher une question
        function showQuestion() {
            const activeQuiz = document.getElementById('activeQuiz');
            const question = currentQuiz.questions[currentQuestionIndex];
            
            let optionsHtml = '';
            question.options.forEach((option, index) => {
                const letter = String.fromCharCode(65 + index); // A, B, C, D
                optionsHtml += `
                    <div class="option" onclick="selectOption(${index})">
                        <div class="option-letter">${letter}</div>
                        <span>${option}</span>
                    </div>
                `;
            });
            
            activeQuiz.innerHTML = `
                <div class="quiz-header">
                    <h3>${currentQuiz.title}</h3>
                    <p>${currentQuiz.category} • Question ${currentQuestionIndex + 1}/${currentQuiz.questions.length}</p>
                </div>
                
                <div class="quiz-progress">
                    <span>Question ${currentQuestionIndex + 1}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%"></div>
                    </div>
                    <span>${currentQuiz.questions.length}</span>
                </div>
                
                <div class="question-container">
                    <div class="question-text">${question.question}</div>
                    <div class="options-container">
                        ${optionsHtml}
                    </div>
                </div>
                
                <div class="quiz-navigation">
                    <button class="nav-btn" onclick="previousQuestion()" ${currentQuestionIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-left"></i>
                        Question précédente
                    </button>
                    
                    ${currentQuestionIndex === currentQuiz.questions.length - 1 ? 
                        `<button class="nav-btn" onclick="finishQuiz()">
                            <i class="fas fa-check"></i>
                            Terminer le quiz
                        </button>` : 
                        `<button class="nav-btn" onclick="nextQuestion()">
                            <i class="fas fa-arrow-right"></i>
                            Question suivante
                        </button>`
                    }
                </div>
            `;
            
            // Restaurer la sélection précédente si elle existe
            if (userAnswers[currentQuestionIndex] !== undefined) {
                const selectedOption = document.querySelectorAll('.option')[userAnswers[currentQuestionIndex]];
                if (selectedOption) {
                    selectedOption.classList.add('selected');
                }
            }
        }

        // Sélectionner une option
        function selectOption(optionIndex) {
            // Enregistrer la réponse
            userAnswers[currentQuestionIndex] = optionIndex;
            
            // Mettre en évidence la sélection
            document.querySelectorAll('.option').forEach(option => {
                option.classList.remove('selected');
            });
            
            document.querySelectorAll('.option')[optionIndex].classList.add('selected');
        }

        // Question suivante
        function nextQuestion() {
            if (currentQuestionIndex < currentQuiz.questions.length - 1) {
                currentQuestionIndex++;
                showQuestion();
            }
        }

        // Question précédente
        function previousQuestion() {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                showQuestion();
            }
        }

        // Terminer le quiz
        function finishQuiz() {
            // Calculer le score
            score = 0;
            currentQuiz.questions.forEach((question, index) => {
                if (userAnswers[index] === question.correct) {
                    score++;
                }
            });
            
            const percentage = Math.round((score / currentQuiz.questions.length) * 100);
            
            // Afficher les résultats
            const activeQuiz = document.getElementById('activeQuiz');
            activeQuiz.innerHTML = `
                <div class="results-screen">
                    <div class="results-icon">${percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '📚'}</div>
                    <h2 class="results-title">Quiz Terminé !</h2>
                    <div class="results-score">${score}/${currentQuiz.questions.length}</div>
                    <div class="results-score" style="font-size: 2.5rem; color: ${percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#dc2626'}">
                        ${percentage}%
                    </div>
                    <p class="results-message">
                        ${percentage >= 80 ? 
                            'Excellent ! Vous maîtrisez bien ce sujet.' : 
                            percentage >= 60 ? 
                            'Bon travail ! Continuez à vous perfectionner.' :
                            'Bon début ! Continuez à apprendre et réessayez.'
                        }
                    </p>
                    
                    <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
                        <button class="nav-btn" onclick="restartQuiz()">
                            <i class="fas fa-redo"></i>
                            Recommencer
                        </button>
                        <button class="nav-btn" onclick="backToQuizzes()" style="background: #4b5563;">
                            <i class="fas fa-home"></i>
                            Retour aux quiz
                        </button>
                    </div>
                </div>
            `;
        }

        // Recommencer le quiz
        function restartQuiz() {
            currentQuestionIndex = 0;
            score = 0;
            userAnswers = [];
            showQuestion();
        }

        // Retour à la liste des quiz
        function backToQuizzes() {
            document.querySelector('.quiz-grid').style.display = 'grid';
            document.querySelector('.section-title').style.display = 'block';
            document.querySelector('.quiz-stats').style.display = 'grid';
            document.getElementById('activeQuiz').style.display = 'none';
        }

        // Exposer les fonctions globalement
        window.startQuiz = startQuiz;
        window.selectOption = selectOption;
        window.nextQuestion = nextQuestion;
        window.previousQuestion = previousQuestion;
        window.finishQuiz = finishQuiz;
        window.restartQuiz = restartQuiz;
        window.backToQuizzes = backToQuizzes;
