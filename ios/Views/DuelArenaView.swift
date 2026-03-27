import SwiftUI

struct DuelArenaView: View {
    @EnvironmentObject var gameState: GameState
    @Environment(\.presentationMode) var presentationMode
    @State private var battleState: BattleState = .searching
    @State private var opponent: PlayerCard?
    
    // Animation States
    @State private var impactScale: CGFloat = 1.0
    @State private var resultOpacity: Double = 0
    
    enum BattleState {
        case searching
        case found
        case clashing
        case result(isVictory: Bool)
    }

    var body: some View {
        ZStack {
            Color(hex: "020817").ignoresSafeArea()
            
            VStack {
                // TOP BAR: Exit button
                HStack {
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 28))
                            .foregroundColor(.white.opacity(0.3))
                    }
                    Spacer()
                }
                .padding(.horizontal)
                .padding(.top, 10)

                // OPPONENT (Top)
                if let opp = opponent {
                    PlayerCardView(card: opp)
                        .scaleEffect(0.8)
                        .offset(y: battleState == .clashing ? 120 : (battleState == .searching ? -600 : 0))
                } else {
                    RadarView().frame(height: 300)
                }

                Spacer()

                // IMPACT VS
                if case .clashing = battleState {
                    Text("VS").font(.system(size: 80, weight: .black)).italic().foregroundColor(.white.opacity(0.2)).scaleEffect(impactScale)
                } else {
                    Image(systemName: "swords").font(.system(size: 40)).foregroundColor(.gold).opacity(0.4)
                }

                Spacer()

                // PLAYER (Bottom)
                if let playerCard = gameState.selectedPlayerCard {
                    PlayerCardView(card: playerCard)
                        .scaleEffect(0.8)
                        .offset(y: battleState == .clashing ? -120 : 0)
                        .shadow(color: .gold.opacity(0.3), radius: 30)
                }
            }
            .padding(.bottom, 40)
            
            // RESULT OVERLAY (Victory / Defeat)
            if case .result(let isVictory) = battleState {
                ResultView(isVictory: isVictory) {
                    resetBattle()
                }
                .opacity(resultOpacity)
                .onAppear {
                    if isVictory { gameState.addRewards(xpGained: 100, coinsGained: 50) }
                    withAnimation(.easeIn(duration: 0.5)) { resultOpacity = 1 }
                }
            }
        }
        .onAppear {
            if gameState.selectedPlayerCard != nil {
                startMatchmaking()
            }
        }
    }
    
    private func startMatchmaking() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 3) {
            withAnimation(.spring()) {
                opponent = PlayerCard(id: "opp", playerId: "opp", playerName: "MBAPPÉ", position: "FWD", nationality: "Francia", flag: "🇫🇷", tier: .momento, rating: 97, stats: PlayerStats(rit: 99, tir: 96, vis: 91, dri: 88, pas: 87, fis: 85), evolution: PlayerEvolution(deltaToday: 5, deltaTournament: 8, lastEvent: "MATCH"))
                battleState = .found
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                withAnimation(.easeInOut(duration: 0.3)) { battleState = .clashing }
                triggerClashAnimation()
                DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                    withAnimation(.spring()) { battleState = .result(isVictory: true) }
                }
            }
        }
    }
    
    private func triggerClashAnimation() {
        withAnimation(.interpolatingSpring(stiffness: 300, damping: 10).repeatCount(3, autoreverses: true)) {
            impactScale = 1.3
        }
    }
    
    private func resetBattle() {
        presentationMode.wrappedValue.dismiss()
    }
}

// Optimized Result View with CONTINUAR button
struct ResultView: View {
    let isVictory: Bool
    let onContinue: () -> Void
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.95).ignoresSafeArea()
            
            VStack(spacing: 30) {
                Text(isVictory ? "VICTORIA" : "DERROTA")
                    .font(.system(size: 64, weight: .black))
                    .italic()
                    .foregroundColor(isVictory ? .emerald : .fire)
                    .shadow(color: isVictory ? .emerald : .fire, radius: 20)
                
                HStack(spacing: 30) {
                    RewardItem(icon: "bolt.fill", color: .ice, label: "XP", amount: "+100")
                    Divider().frame(height: 50).background(Color.white.opacity(0.1))
                    RewardItem(icon: "bitcoinsign.circle.fill", color: .gold, label: "COINS", amount: "+50")
                }
                .padding(30)
                .background(Color.white.opacity(0.05))
                .cornerRadius(25)
                
                Button(action: onContinue) {
                    Text("CONTINUAR")
                        .font(.system(size: 16, weight: .black))
                        .foregroundColor(.void)
                        .frame(width: 240)
                        .padding(.vertical, 18)
                        .background(Color.gold)
                        .cornerRadius(20)
                        .shadow(color: .gold.opacity(0.4), radius: 20)
                }
            }
            .padding(40)
        }
    }
}

struct RewardItem: View {
    let icon: String
    let color: Color
    let label: String
    let amount: String
    
    var body: some View {
        VStack(spacing: 5) {
            Image(systemName: icon).foregroundColor(color).font(.title3)
            Text(label).font(.system(size: 10, weight: .black)).foregroundColor(.gray)
            Text(amount).font(.system(size: 24, weight: .black)).foregroundColor(color)
        }
    }
}
