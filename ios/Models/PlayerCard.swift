import Foundation

enum CardTier: String, Codable, CaseIterable {
    case legend = "LEGEND"
    case elite = "ELITE"
    case momento = "MOMENTO"
    case rising = "RISING"
    case base = "BASE"
}

struct PlayerStats: Codable {
    var rit: Int
    var tir: Int
    var vis: Int
    var dri: Int
    var pas: Int
    var fis: Int
}

struct PlayerEvolution: Codable {
    var deltaToday: Int
    var deltaTournament: Int
    var lastEvent: String
}

struct PlayerCard: Identifiable, Codable {
    var id: String
    var playerId: String
    var playerName: String
    var imageUrl: String?
    var position: String // FWD, MID, DEF, GK
    var nationality: String
    var flag: String
    var tier: CardTier
    var rating: Int
    var stats: PlayerStats
    var evolution: PlayerEvolution
    var isLive: Bool = false
}

// Mock Data for Implementation
extension PlayerCard {
    static let mockMessi = PlayerCard(
        id: "1",
        playerId: "p-messi",
        playerName: "MESSI",
        imageUrl: "messi_photo", // Resurso local en Xcode
        position: "FWD",
        nationality: "Argentina",
        flag: "🇦🇷",
        tier: .legend,
        rating: 99,
        stats: PlayerStats(rit: 99, tir: 99, vis: 99, dri: 99, pas: 98, fis: 78),
        evolution: PlayerEvolution(deltaToday: 3, deltaTournament: 5, lastEvent: "HAT-TRICK"),
        isLive: false
    )
}
