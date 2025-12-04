// Variables globales
// @ts-nocheck
        let selectedFormation = {
            title: '',
            price: 0
        };
        
        let selectedPaymentMethod = '';

        // Configuration des numéros (à personnaliser)
        const paymentConfig = {
            wave: {
                number: "+225 07 00 31 83 28", // Remplace par ton numéro Wave
                instructions: [
                    "Ouvrez l'application Wave sur votre téléphone",
                    "Allez dans 'Transférer de l'argent'",
                    "Entrez le numéro ci-dessus",
                    "Saisissez le montant exact indiqué",
                    "Ajoutez votre nom dans la description",
                    "Validez le transfert"
                ]
            },
            mtn: {
                number: "+225  05 85 70 13 37", // Ton numéro MTN
                instructions: [
                    "Composez le code USSD *133#",
                    "Sélectionnez 'Transfert d'argent'",
                    "Entrez le numéro ci-dessus",
                    "Saisissez le montant exact",
                    "Entrez votre code secret",
                    "Confirmez la transaction"
                ]
            },
            orange: {
                number: "+225 07 00 31 83 28", // Remplace par ton numéro Orange
                instructions: [
                    "Composez le code USSD #144#",
                    "Sélectionnez 'Envoyer de l'argent'",
                    "Entrez le numéro ci-dessus",
                    "Saisissez le montant exact",
                    "Entrez votre code PIN",
                    "Validez l'opération"
                ]
            }
        };

        // Filtrage des formations
        function filterFormations(category) {
            const formations = document.querySelectorAll('.formation-card');
            const buttons = document.querySelectorAll('.category-btn');
            
            // Mettre à jour les boutons actifs
            buttons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.textContent.toLowerCase().includes(category) || 
                    (category === 'all' && btn.textContent === 'Toutes')) {
                    btn.classList.add('active');
                }
            });
            
            // Filtrer les formations
            formations.forEach(formation => {
                if (category === 'all' || formation.dataset.category === category) {
                    formation.style.display = 'grid';
                } else {
                    formation.style.display = 'none';
                }
            });
        }

        // Ouvrir le modal de paiement manuel
        function openPaymentModal(title, price) {
            selectedFormation.title = title;
            selectedFormation.price = price;
            
            // Réinitialiser la sélection
            selectedPaymentMethod = '';
            document.querySelectorAll('.payment-method').forEach(option => {
                option.classList.remove('selected');
            });
            document.getElementById('paymentInstructions').style.display = 'none';
            document.getElementById('confirmationSection').style.display = 'none';
            
            // Mettre à jour le titre
            document.getElementById('modalFormationTitle').textContent = 
                `Formation : ${title} - ${price.toLocaleString()} FCFA`;
            
            // Afficher le modal
            document.getElementById('manualPaymentModal').style.display = 'block';
        }

        // Sélectionner une méthode de paiement manuel
        function selectManualPayment(method) {
            selectedPaymentMethod = method;
            
            // Mettre en évidence la sélection
            document.querySelectorAll('.payment-method').forEach(option => {
                option.classList.remove('selected');
            });
            event.currentTarget.classList.add('selected');
            
            // Afficher les instructions
            showPaymentInstructions(method);
        }

        // Afficher les instructions de paiement
        function showPaymentInstructions(method) {
            const config = paymentConfig[method];
            const instructionsDiv = document.getElementById('paymentInstructions');
            
            instructionsDiv.innerHTML = `
                <div class="payment-details">
                    <h4><i class="fas fa-money-check-alt"></i> Instructions de paiement</h4>
                    
                    <p style="margin-bottom: 1rem; color: var(--dark);">
                        Veuillez transférer <strong>${selectedFormation.price.toLocaleString()} FCFA</strong> au numéro suivant :
                    </p>
                    
                    <div class="phone-number">
                        ${config.number}
                    </div>
                    
                    <button class="copy-btn" onclick="copyToClipboard('${config.number}')">
                        <i class="fas fa-copy"></i> Copier le numéro
                    </button>
                    
                    <div class="instructions" style="margin-top: 1.5rem;">
                        <h5 style="margin-bottom: 10px; color: var(--warning);">
                            <i class="fas fa-list-ol"></i> Étapes à suivre :
                        </h5>
                        <ul>
                            ${config.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <p style="margin-top: 1rem; color: var(--dark); font-size: 0.9rem;">
                        <i class="fas fa-exclamation-circle"></i>
                        <strong>Important :</strong> Conservez bien le reçu de transaction.
                    </p>
                </div>
            `;
            
            instructionsDiv.style.display = 'block';
            document.getElementById('confirmationSection').style.display = 'block';
            
            // Faire défiler vers le bas
            instructionsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Confirmer le paiement
        function confirmPayment() {
            if (!selectedPaymentMethod) {
                showNotification('Veuillez d\'abord sélectionner une méthode de paiement', 'error');
                return;
            }
            
            const config = paymentConfig[selectedPaymentMethod];
            const message = encodeURIComponent(
                `[CONFIRMATION DE PAIEMENT]\n\n` +
                `Formation : ${selectedFormation.title}\n` +
                `Montant : ${selectedFormation.price.toLocaleString()} FCFA\n` +
                `Méthode : ${selectedPaymentMethod.toUpperCase()}\n` +
                `Numéro de transfert : ${config.number}\n\n` +
                `J'ai effectué le transfert et je joins la capture d'écran du reçu.`
            );
            
            const whatsappUrl = `https://wa.me/2250711041528?text=${message}`;
            
            // Afficher une notification
            showNotification('Redirection vers WhatsApp...', 'success');
            
            // Ouvrir WhatsApp après un court délai
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                
                // Fermer le modal après 1 seconde
                setTimeout(() => {
                    closeManualModal();
                    showNotification('Merci ! Nous traiterons votre demande rapidement.', 'success');
                }, 1000);
            }, 1500);
        }

        // Copier le numéro dans le presse-papier
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Numéro copié dans le presse-papier !', 'success');
            }).catch(err => {
                console.error('Erreur lors de la copie : ', err);
                showNotification('Erreur lors de la copie', 'error');
            });
        }

        // Afficher une notification
        function showNotification(message, type = 'success') {
            const notification = document.getElementById('notification');
            const notificationText = document.getElementById('notificationText');
            
            notificationText.textContent = message;
            
            // Changer la couleur selon le type
            if (type === 'error') {
                notification.style.background = '#ef4444';
            } else if (type === 'warning') {
                notification.style.background = '#f59e0b';
            } else {
                notification.style.background = '#10b981';
            }
            
            notification.style.display = 'block';
            
            // Masquer après 5 secondes
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }

        // Fermer le modal manuel
        function closeManualModal() {
            document.getElementById('manualPaymentModal').style.display = 'none';
        }

        // Fermer les modals en cliquant en dehors
        window.onclick = function(event) {
            const modal = document.getElementById('manualPaymentModal');
            if (event.target === modal) {
                closeManualModal();
            }
        }

        // Écouter la touche Échap pour fermer les modals
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeManualModal();
            }
        });

        // Redirection WhatsApp
        function redirectToWhatsApp() {
            window.open('https://wa.me/2250711041528', '_blank');
        }