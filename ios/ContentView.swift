import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        ZStack {
            // Global App Background
            Color(hex: "020817")
                .ignoresSafeArea()
            
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
                    .tabItem {
                        Label("COLECCIÓN", systemImage: "square.grid.2x2.fill")
                    }
                    .tag(0)
                
                // 2. Play / Duelos View
                Text("ARENA DE DUELOS")
                    .font(.display(32))
                    .tabItem {
                        Label("DUELOS", systemImage: "swords.fill")
                    }
                    .tag(1)
                
                // 3. Mercado View
                Text("MERCADO P2P")
                    .tabItem {
                        Label("MERCADO", systemImage: "cart.fill")
                    }
                    .tag(2)
                
                // 4. Momentos View
                Text("MOMENTOS VIVOS")
                    .tabItem {
                        Label("MOMENTOS", systemImage: "bolt.fill")
                    }
                    .tag(3)
            }
            .accentColor(Color(hex: "F2C441")) // Gold Accent
            .onAppear {
                // Estilo para el TabBar en iOS
                let appearance = UITabBarAppearance()
                appearance.configureWithTransparentBackground()
                appearance.backgroundColor = UIColor(Color(hex: "0A1422").opacity(0.8))
                appearance.backgroundEffect = UIBlurEffect(style: .systemUltraThinMaterialDark)
                
                UITabBar.appearance().standardAppearance = appearance
                UITabBar.appearance().scrollEdgeAppearance = appearance
            }
        }
    }
}

// Sub-view para la Colección
struct CollectionHomeView: View {
    let mockCards: [PlayerCard] = [
        .mockMessi,
        PlayerCard(id: "2", playerId: "p-mbappe", playerName: "MBAPPÉ", imageUrl: nil, position: "FWD", nationality: "Francia", flag: "🇫🇷", tier: .momento, rating: 97, stats: PlayerStats(rit: 99, tir: 96, vis: 91, dri: 88, pas: 87, fis: 85), evolution: PlayerEvolution(deltaToday: 5, deltaTournament: 8, lastEvent: "GOL")),
        PlayerCard(id: "3", playerId: "p-yamal", playerName: "YAMAL", imageUrl: nil, position: "FWD", nationality: "España", flag: "🇪🇸", tier: .rising, rating: 88, stats: PlayerStats(rit: 91, tir: 86, vis: 84, dri: 95, pas: 79, fis: 82), evolution: PlayerEvolution(deltaToday: 11, deltaTournament: 11, lastEvent: "DEBUT"))
    ]
    
    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                
                // Header
                HStack {
                    VStack(alignment: .leading) {
                        Text("MI COLECCIÓN")
                            .font(.system(size: 10, weight: .black))
                            .tracking(4)
                            .foregroundColor(.white.opacity(0.4))
                        Text("MASTER DECK")
                            .font(.system(size: 24, weight: .black))
                            .italic()
                    }
                    Spacer()
                    Image(systemName: "line.3.horizontal.decrease.circle.fill")
                        .font(.title2)
                        .foregroundColor(.gold)
                }
                .padding(.horizontal)
                .padding(.top, 20)
                
                // Moment Alert Area (SwiftUI Version)
                ZStack {
                    RoundedRectangle(cornerRadius: 24)
                        .fill(LinearGradient(colors: [Color.purple.opacity(0.2), .clear], startPoint: .topLeading, endPoint: .bottomTrailing))
                        .overlay(RoundedRectangle(cornerRadius: 24).stroke(Color.white.opacity(0.1), lineWidth: 1))
                    
                    VStack(spacing: 8) {
                        Text("✦ MOMENTO ACTIVO")
                            .font(.system(size: 8, weight: .black))
                            .tracking(3)
                            .foregroundColor(.purple)
                        
                        Text("MESSI VS NED")
                            .font(.system(size: 20, weight: .black))
                            .italic()
                        
                        Text("RECLAMAR AHORA")
                            .font(.system(size: 10, weight: .black))
                            .padding(.horizontal, 20)
                            .padding(.vertical, 8)
                            .background(Color.purple)
                            .cornerRadius(12)
                    }
                    .padding()
                }
                .padding(.horizontal)
                .frame(height: 120)
                
                // Horizontal Collection Rail
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        ForEach(mockCards) { card in
                            PlayerCardView(card: card)
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 20)
                }
                
                // Bottom Section Placeholder
                Text("TÁCTICA RECIENTE")
                    .font(.system(size: 10, weight: .black))
                    .tracking(3)
                    .foregroundColor(.white.opacity(0.3))
                    .padding(.horizontal)
                
                RoundedRectangle(cornerRadius: 20)
                    .fill(Color.white.opacity(0.03))
                    .frame(height: 180)
                    .padding(.horizontal)
                    .overlay(
                        Text("Squad Pitch Visualization")
                            .font(.caption)
                            .foregroundColor(.gray)
                    )
            }
        }
    }
}

// Extension to help with custom fonts if added
extension Font {
    static func display(_ size: CGFloat) -> Font {
        return .system(size: size, weight: .black, design: .serif)
    }
}

extension Color {
    static let gold = Color(hex: "F2C441")
    static let ice = Color(hex: "38D9F5")
}
