
package main

import (
    "encoding/json"
    "fmt"
    "net"
    "net/http"
    "sync"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/gorilla/websocket"
)

// Log and Stats Data Structures
type Log struct {
    Message string `json:"message"`
}

type Stats struct {
    SharesSubmitted int     `json:"shares_submitted"`
    HashRate        float64 `json:"hash_rate"`
}

var (
    logs  []Log
    stats = Stats{SharesSubmitted: 0, HashRate: 0}
    lock  sync.Mutex
    upgrader = websocket.Upgrader{
        CheckOrigin: func(r *http.Request) bool {
            return true
        },
    }
)

// Add a new log entry
func addLog(message string) {
    lock.Lock()
    defer lock.Unlock()
    logs = append(logs, Log{Message: message})
    if len(logs) > 100 {
        logs = logs[1:]
    }
}

// Update stats
func updateStats(shares int, hashRate float64) {
    lock.Lock()
    defer lock.Unlock()
    stats.SharesSubmitted += shares
    stats.HashRate = hashRate
}

// Handle WebSocket connections for logs and stats
func wsHandler(c *gin.Context) {
    conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
    if err != nil {
        fmt.Println("Failed to upgrade connection:", err)
        return
    }
    defer conn.Close()

    for {
        lock.Lock()
        logsCopy := logs
        statsCopy := stats
        lock.Unlock()

        data := map[string]interface{}{
            "logs":  logsCopy,
            "stats": statsCopy,
        }

        err := conn.WriteJSON(data)
        if err != nil {
            fmt.Println("Failed to send data:", err)
            break
        }
        time.Sleep(2 * time.Second)
    }
}

// Handle incoming miner connections
func handleMiner(conn net.Conn) {
    defer conn.Close()
    addLog(fmt.Sprintf("New miner connected: %s", conn.RemoteAddr().String()))
    updateStats(1, 50.5) // Simulate stats update
}

// Start the mining proxy server
func startProxy() {
    listener, err := net.Listen("tcp", ":8080")
    if err != nil {
        fmt.Println("Failed to start proxy:", err)
        return
    }
    defer listener.Close()
    fmt.Println("Proxy running on 0.0.0.0:8080")

    for {
        conn, err := listener.Accept()
        if err != nil {
            fmt.Println("Failed to accept connection:", err)
            continue
        }
        go handleMiner(conn)
    }
}

func main() {
    go startProxy()

    r := gin.Default()
    r.GET("/ws", func(c *gin.Context) {
        wsHandler(c)
    })

    r.GET("/stats", func(c *gin.Context) {
        lock.Lock()
        defer lock.Unlock()
        c.JSON(http.StatusOK, stats)
    })

    r.Run(":5000")
}
