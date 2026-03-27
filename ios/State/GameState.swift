import SwiftUI
import Combine

class GameState: ObservableObject {
    @Published var coins: Int = 12500
    @Published var xp: Int = 450
    @Published var userCards: [PlayerCard] = [.mockMessi]
    @Published var selectedPlayerCard: PlayerCard? = .mockMessi
    
    // UI Feedback
    @Published var showingAlert = false
    @Published var alertMessage = ""
    
    private let haptic = UIImpactFeedbackGenerator(style: .medium)

    // MARK: - Actions
    
    func buyCard(item: MarketItem) {
        if coins >= item.price {
            coins -= item.price
            userCards.append(item.card)
            haptic.impactOccurred()
            triggerAlert(message: "¡COMPRA EXITOSA! \(item.card.playerName) AÑADIDO.")
        } else {
            triggerAlert(message: "MONEDAS INSUFICIENTES.")
        }
    }
    
    func claimMoment(card: PlayerCard) {
        userCards.append(card)
        haptic.impactOccurred(intensity: 1.0)
        triggerAlert(message: "¡MOMENTO RECLAMADO! REVISA TU COLECCIÓN.")
    }
    
    func addRewards(xpGained: Int, coinsGained: Int) {
        xp += xpGained
        coins += coinsGained
        haptic.impactOccurred(intensity: 0.8)
    }
    
    func selectCard(card: PlayerCard) {
        selectedPlayerCard = card
        haptic.impactOccurred(style: .light)
    }

    private func triggerAlert(message: String) {
        alertMessage = message
        showingAlert = true
    }
}
