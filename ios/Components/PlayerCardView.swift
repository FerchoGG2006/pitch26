import SwiftUI

struct PlayerCardView: View {
    let card: PlayerCard
    
    // Animation State
    @State private var isAnimating = false
    @State private var dragOffset = CGSize.zero
    
    var body: some View {
        ZStack {
            // 1. Base Card Chassis (Glassmorphism)
            RoundedRectangle(cornerRadius: 32)
                .fill(Color(hex: "0A1422"))
                .overlay(
                    RoundedRectangle(cornerRadius: 32)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
                .shadow(color: .black.opacity(0.8), radius: 20, x: 0, y: 15)
            
            // 2. Content Container
            VStack(spacing: 12) {
                
                // Header: Tier & Rating
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(card.tier.rawValue)
                            .font(.system(size: 8, weight: .black))
                            .tracking(2)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(tierColor.opacity(0.2))
                            .cornerRadius(4)
                            .foregroundColor(tierColor)
                        
                        Text("\(card.rating)")
                            .font(.system(size: 48, weight: .black, design: .monospaced))
                            .italic()
                            .foregroundColor(tierColor)
                            .shadow(color: tierColor.opacity(0.3), radius: 10)
                        
                        Text(card.position)
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.gray)
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing) {
                        Text(card.flag)
                            .font(.system(size: 32))
                        
                        if card.isLive {
                            Text("● LIVE")
                                .font(.system(size: 8, weight: .bold))
                                .foregroundColor(.red)
                                .padding(.horizontal, 4)
                                .padding(.vertical, 2)
                                .background(Color.white.opacity(0.1))
                                .clipShape(Capsule())
                        }
                    }
                }
                .padding(.top, 10)
                
                // 3. Image Shield (Masked)
                ZStack {
                    // Shield Mask Concept in SwiftUI
                    Image(card.imageUrl ?? "placeholder")
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(height: 160)
                        .clipShape(ShieldShape())
                        .overlay(
                            LinearGradient(
                                colors: [.clear, Color(hex: "0A1422")],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                }
                .padding(.top, -10)
                
                // 4. Player Name
                Text(card.playerName)
                    .font(.system(size: 28, weight: .black, design: .serif))
                    .italic()
                    .tracking(2)
                    .foregroundColor(.white)
                    .lineLimit(1)
                    .overlay(
                        Rectangle()
                            .frame(height: 1)
                            .foregroundColor(.white.opacity(0.1))
                            .offset(y: 18)
                    )
                
                // 5. Stats Matrix (3x2)
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                    StatItem(label: "RIT", value: card.stats.rit, color: tierColor)
                    StatItem(label: "TIR", value: card.stats.tir, color: tierColor)
                    StatItem(label: "VIS", value: card.stats.vis, color: tierColor)
                    StatItem(label: "DRI", value: card.stats.dri, color: tierColor)
                    StatItem(label: "PAS", value: card.stats.pas, color: tierColor)
                    StatItem(label: "FIS", value: card.stats.fis, color: tierColor)
                }
                .padding(.top, 5)
                
                // 6. Action Feed
                HStack {
                    Text(card.evolution.lastEvent)
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.gray)
                    Spacer()
                    Text(card.evolution.deltaToday >= 0 ? "▲ +\(card.evolution.deltaToday)" : "▼ \(card.evolution.deltaToday)")
                        .font(.system(size: 9, weight: .black))
                        .foregroundColor(card.evolution.deltaToday >= 0 ? .green : .red)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 8)
                .background(Color.white.opacity(0.03))
                .cornerRadius(12)
            }
            .padding(20)
            
            // Holographic Glare Overlay
            LinearGradient(
                colors: [.clear, .white.opacity(0.1), .clear],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .blendMode(.overlay)
            .opacity(isAnimating ? 0.3 : 0)
        }
        .frame(width: 220, height: 310) // Standard Digital Core Size
        .rotation3DEffect(
            .degrees(Double(dragOffset.width / 10)),
            axis: (x: 0, y: 1, z: 0)
        )
        .rotation3DEffect(
            .degrees(Double(-dragOffset.height / 10)),
            axis: (x: 1, y: 0, z: 0)
        )
        .gesture(
            DragGesture()
                .onChanged { gesture in
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                        dragOffset = gesture.translation
                    }
                }
                .onEnded { _ in
                    withAnimation(.spring(response: 0.5, dampingFraction: 0.5)) {
                        dragOffset = .zero
                    }
                }
        )
    }
    
    // Helpers
    private var tierColor: Color {
        switch card.tier {
        case .legend: return Color(hex: "F2C441")
        case .elite: return Color(hex: "C8C8C8")
        case .momento: return Color(hex: "A070FF")
        case .rising: return Color(hex: "00DFA0")
        case .base: return Color.gray
        }
    }
}

struct StatItem: View {
    let label: String
    let value: Int
    let color: Color
    
    var body: some View {
        VStack(spacing: 2) {
            Text(label)
                .font(.system(size: 7, weight: .bold))
                .foregroundColor(.white.opacity(0.4))
            Text("\(value)")
                .font(.system(size: 14, weight: .black))
                .foregroundColor(color)
        }
    }
}

struct ShieldShape: Shape {
    func path(in rect: CGRect) -> Path {
        var path = Path()
        path.move(to: CGPoint(x: 0, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: 0))
        path.addLine(to: CGPoint(x: rect.width, y: rect.height * 0.88))
        path.addLine(to: CGPoint(x: rect.width * 0.5, y: rect.height))
        path.addLine(to: CGPoint(x: 0, y: rect.height * 0.88))
        path.closeSubpath()
        return path
    }
}

// Global Hex extension for Colors
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
