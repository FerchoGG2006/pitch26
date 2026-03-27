import SwiftUI

// --- MARKET VIEW (UPDATED) ---
struct MarketView: View {
    @EnvironmentObject var gameState: GameState
    
    let mockMarketCards: [MarketItem] = [
        MarketItem(card: .mockMessi, price: 15000),
        MarketItem(card: PlayerCard(id: "m2", playerId: "p-vini", playerName: "VINI JR", position: "FWD", nationality: "Brasil", flag: "🇧🇷", tier: .elite, rating: 91, stats: PlayerStats(rit: 97, tir: 82, vis: 80, dri: 92, pas: 78, fis: 70), evolution: PlayerEvolution(deltaToday: 0, deltaTournament: 2, lastEvent: "MATCH")), price: 4200),
        MarketItem(card: PlayerCard(id: "m3", playerId: "p-kimmich", playerName: "KIMMICH", position: "MID", nationality: "Alemania", flag: "🇩🇪", tier: .base, rating: 88, stats: PlayerStats(rit: 70, tir: 72, vis: 94, dri: 84, pas: 90, fis: 81), evolution: PlayerEvolution(deltaToday: -1, deltaTournament: -1, lastEvent: "L")), price: 1200)
    ]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header with balance
                HStack {
                   Text("MERCADO P2P").font(.display(24)).italic()
                   Spacer()
                   HStack(spacing: 5) {
                       Image(systemName: "bitcoinsign.circle.fill").foregroundColor(.gold)
                       Text("\(gameState.coins)").font(.system(size: 16, weight: .black, design: .monospaced))
                   }
                   .padding(.horizontal, 12).padding(.vertical, 6)
                   .background(Color.white.opacity(0.05)).cornerRadius(12)
                }
                .padding(.horizontal).padding(.top, 20)
                
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 20) {
                    ForEach(mockMarketCards) { item in
                        VStack(spacing: 12) {
                            PlayerCardView(card: item.card)
                                .scaleEffect(0.6).frame(height: 180)
                            
                            HStack {
                                Image(systemName: "bitcoinsign.circle.fill").foregroundColor(.gold)
                                Text("\(item.price)").font(.system(size: 14, weight: .black))
                            }
                            
                            Button(action: {
                                gameState.buyCard(item: item)
                            }) {
                                Text("COMPRAR")
                                    .font(.system(size: 10, weight: .black))
                                    .foregroundColor(.void).padding(.vertical, 10).frame(maxWidth: .infinity)
                                    .background(Color.gold).cornerRadius(10)
                            }
                        }
                        .padding(15).background(Color.white.opacity(0.04)).cornerRadius(22)
                    }
                }
                .padding(.horizontal)
            }
            .padding(.bottom, 150)
        }
    }
}

// --- MOMENTS VIEW (UPDATED) ---
struct MomentsView: View {
    @EnvironmentObject var gameState: GameState
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 25) {
                Text("MOMENTOS VIVOS").font(.display(24)).italic().padding(.horizontal).padding(.top, 20)

                ZStack {
                    RoundedRectangle(cornerRadius: 30)
                        .fill(LinearGradient(colors: [Color.purple.opacity(0.4), Color.ice.opacity(0.1)], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .frame(height: 220)
                    
                    VStack(spacing: 15) {
                        Text("✦ EVENTO GLOBAL").font(.system(size: 10, weight: .black)).tracking(4).foregroundColor(.purple)
                        Text("EL REGRESO DEL REY").font(.system(size: 28, weight: .black)).italic().multilineTextAlignment(.center)
                        
                        Button(action: {
                            gameState.claimMoment(card: .mockMessi)
                        }) {
                            Text("RECLAMAR AHORA")
                                .font(.system(size: 12, weight: .black)).foregroundColor(.white)
                                .padding(.horizontal, 40).padding(.vertical, 14)
                                .background(Color.purple).cornerRadius(15).shadow(color: .purple.opacity(0.5), radius: 15)
                        }
                    }
                }
                .padding(.horizontal)
            }
            .padding(.bottom, 150)
        }
    }
}
