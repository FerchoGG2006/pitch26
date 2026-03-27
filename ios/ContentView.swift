import SwiftUI

struct ContentView: View {
    @StateObject var gameState = GameState()
    @State private var selectedTab = 0
    
    var body: some View {
        ZStack {
            // Global App Background
            Color(hex: "020817").ignoresSafeArea()
            
            RadialGradient(
                colors: [Color(hex: "38D9F5").opacity(0.1), .clear],
                center: .top,
                startRadius: 0,
                endRadius: 600
            )
            .ignoresSafeArea()

            TabView(selection: $selectedTab) {
                // 1. Colección View
                CollectionHomeView()
                    .environmentObject(gameState)
                    .tabItem {
                        Label("COLECCIÓN", systemImage: "square.grid.2x2.fill")
                    }
                    .tag(0)
                
                // 2. Play / Duelos View
                DuelArenaView()
                    .environmentObject(gameState)
                    .tabItem {
                        Label("DUELOS", systemImage: "swords.fill")
                    }
                    .tag(1)
                
                // 3. Mercado View
                MarketView()
                    .environmentObject(gameState)
                    .tabItem {
                        Label("MERCADO", systemImage: "cart.fill")
                    }
                    .tag(2)
                
                // 4. Momentos View
                MomentsView()
                    .environmentObject(gameState)
                    .tabItem {
                        Label("MOMENTOS", systemImage: "bolt.fill")
                    }
                    .tag(3)
            }
            .accentColor(Color(hex: "F2C441"))
            .onAppear {
                setupAppearance()
            }
            
            // Global Overlay for State Feedback
            if gameState.showingAlert {
                GlobalAlertOverlay(message: gameState.alertMessage) {
                    gameState.showingAlert = false
                }
            }
        }
    }
    
    // UI Style Fix
    private func setupAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithTransparentBackground()
        appearance.backgroundColor = UIColor(Color(hex: "0A1422").opacity(0.8))
        appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterialDark)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}

// Global Alert for Purchases/Claims
struct GlobalAlertOverlay: View {
    let message: String
    let onDismiss: () -> Void
    
    var body: some View {
        ZStack {
            Color.black.opacity(0.6).ignoresSafeArea()
            
            VStack(spacing: 20) {
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 40))
                    .foregroundColor(.gold)
                
                Text(message)
                    .font(.system(size: 14, weight: .black))
                    .multilineTextAlignment(.center)
                    .foregroundColor(.white)
                
                Button(action: onDismiss) {
                    Text("ENTENDIDO")
                        .font(.system(size: 10, weight: .black))
                        .foregroundColor(.void)
                        .padding(.horizontal, 30)
                        .padding(.vertical, 12)
                        .background(Color.gold)
                        .cornerRadius(12)
                }
            }
            .padding(30)
            .background(Color(hex: "0A1422"))
            .cornerRadius(25)
            .overlay(RoundedRectangle(cornerRadius: 25).stroke(Color.white.opacity(0.1), lineWidth: 1))
            .shadow(color: .gold.opacity(0.2), radius: 30)
        }
        .transition(.opacity.combined(with: .scale))
    }
}

// Updated Collection View using EnvironmentObject
struct CollectionHomeView: View {
    @EnvironmentObject var gameState: GameState
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                // Header with User Stats
                HStack {
                    VStack(alignment: .leading) {
                        Text("COINS")
                            .font(.system(size: 8, weight: .black))
                            .foregroundColor(.gold)
                        Text("\(gameState.coins)")
                            .font(.system(size: 20, weight: .black, design: .monospaced))
                    }
                    Spacer()
                    VStack(alignment: .trailing) {
                        Text("XP")
                            .font(.system(size: 8, weight: .black))
                            .foregroundColor(.ice)
                        Text("\(gameState.xp)")
                            .font(.system(size: 20, weight: .black, design: .monospaced))
                    }
                }
                .padding(.horizontal)
                .padding(.top, 10)

                // Moment Alert Area (SwiftUI Version)
                ZStack {
                    RoundedRectangle(cornerRadius: 24)
                        .fill(LinearGradient(colors: [Color.purple.opacity(0.2), .clear], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.white.opacity(0.1), lineWidth: 1))
                    
                    VStack(spacing: 8) {
                        Text("✦ MOMENTO ACTIVO")
                            .font(.system(size: 8, weight: .black)).foregroundColor(.purple)
                        Text("MESSI VS NED").font(.system(size: 20, weight: .black)).italic()
                        Button(action: {
                            gameState.claimMoment(card: .mockMessi)
                        }) {
                            Text("RECLAMAR AHORA")
                                .font(.system(size: 10, weight: .black))
                                .padding(.horizontal, 20).padding(.vertical, 8)
                                .background(Color.purple).cornerRadius(12)
                        }
                    }
                }
                .padding(.horizontal).frame(height: 120)
                
                // Horizontal Collection Rail
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        ForEach(gameState.userCards) { card in
                            PlayerCardView(card: card)
                                .onTapGesture {
                                    gameState.selectCard(card: card)
                                }
                                .overlay(
                                    RoundedRectangle(cornerRadius: 32)
                                        .stroke(Color.gold, lineWidth: gameState.selectedPlayerCard?.id == card.id ? 3 : 0)
                                )
                        }
                    }
                    .padding(.horizontal).padding(.bottom, 20)
                }
                
                Text("TÁCTICA RECIENTE").font(.system(size: 10, weight: .black)).padding(.horizontal)
                RoundedRectangle(cornerRadius: 20).fill(Color.white.opacity(0.03)).frame(height: 180).padding(.horizontal)
            }
        }
    }
}
