"use client"

import { useState, useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text, Line } from "@react-three/drei"
import * as THREE from "three"

interface ThreatNode {
  id: string
  position: [number, number, number]
  type: "server" | "threat" | "firewall" | "user"
  severity: "low" | "medium" | "high" | "critical"
  connections: string[]
  data: any
}

interface NetworkConnection {
  from: string
  to: string
  type: "normal" | "threat" | "blocked"
  intensity: number
}

interface GlobalThreat {
  id: string
  lat: number
  lng: number
  intensity: number
  type: string
  country: string
  city: string
  attackType: string
  timestamp: number
  duration: number
  sourceIP: string
  targetIP: string
}

function ThreatParticles({ isPlaying }: { isPlaying: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const particleCount = 1500

  const { particles, initialPositions } = (() => {
    const tempParticles: any[] = []
    const tempInitialPositions: number[][] = []
    
    for (let i = 0; i < particleCount; i++) {
      const radius = 8 + Math.random() * 15
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI

      const position = [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      ]

      tempParticles.push({
        position: [...position],
        velocity: [(Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02],
        scale: Math.random() * 0.3 + 0.1,
        phase: Math.random() * Math.PI * 2,
        orbitSpeed: (Math.random() - 0.5) * 0.01,
        threatLevel: Math.random(),
        pulseSpeed: 0.5 + Math.random() * 2,
      })
      
      tempInitialPositions.push([...position])
    }
    return { particles: tempParticles, initialPositions: tempInitialPositions }
  })()

  useFrame((state) => {
    if (!meshRef.current || !isPlaying) return

    const time = state.clock.getElapsedTime()
    const matrix = new THREE.Matrix4()
    const color = new THREE.Color()

    for (let i = 0; i < particleCount; i++) {
      const particle = particles[i]
      
      // Orbital motion
      const orbitRadius = Math.sqrt(
        initialPositions[i][0] ** 2 + 
        initialPositions[i][1] ** 2 + 
        initialPositions[i][2] ** 2
      )
      
      const orbitAngle = time * particle.orbitSpeed + particle.phase
      const currentRadius = orbitRadius + Math.sin(time * 2 + i * 0.1) * 2

      particle.position[0] = currentRadius * Math.sin(orbitAngle) * Math.cos(particle.phase)
      particle.position[1] += particle.velocity[1]
      particle.position[2] = currentRadius * Math.cos(orbitAngle) * Math.sin(particle.phase)

      // Boundary check
      if (Math.abs(particle.position[1]) > 25) particle.velocity[1] *= -1

      // Dynamic scaling with pulsing effect
      const scale = particle.scale * (1 + Math.sin(time * particle.pulseSpeed + i * 0.05) * 0.5)

      // Dynamic color based on threat level
      const hue = particle.threatLevel > 0.7 ? 0.95 : particle.threatLevel > 0.4 ? 0.05 : 0.15
      const saturation = 0.8
      const lightness = 0.4 + particle.threatLevel * 0.3
      color.setHSL(hue, saturation, lightness)

      matrix.makeTranslation(particle.position[0], particle.position[1], particle.position[2])
      matrix.scale(new THREE.Vector3(scale, scale, scale))

      if (meshRef.current && i < meshRef.current.count) {
        meshRef.current.setMatrixAt(i, matrix)
        meshRef.current.setColorAt(i, color)
      }
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true
      if (meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true
      }
    }
  })

  const geometry = new THREE.SphereGeometry(0.05, 8, 8)
  const material = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  })

  return <instancedMesh ref={meshRef} args={[geometry, material, particleCount]} />
}

function NetworkNode({ node, onClick, isPlaying }: { node: ThreatNode; onClick: (node: ThreatNode) => void; isPlaying: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (!meshRef.current || !isPlaying) return
    const time = state.clock.getElapsedTime()

    // Rotate based on threat level
    if (node.severity === "critical") {
      meshRef.current.rotation.y = time * 2
    } else if (node.severity === "high") {
      meshRef.current.rotation.y = time * 1
    }

    // Pulsing effect for threats
    if (node.type === "threat") {
      const scale = 1 + Math.sin(time * 3) * 0.2
      meshRef.current.scale.setScalar(scale)
    }
  })

  const getNodeColor = () => {
    switch (node.type) {
      case "server":
        return "#00ff88"
      case "threat":
        return node.severity === "critical" ? "#ff0044" : node.severity === "high" ? "#ff6600" : "#ffaa00"
      case "firewall":
        return "#0088ff"
      case "user":
        return "#88aaff"
      default:
        return "#ffffff"
    }
  }

  const getNodeGeometry = () => {
    switch (node.type) {
      case "server":
        return <boxGeometry args={[1, 1, 1]} />
      case "threat":
        return <octahedronGeometry args={[0.8]} />
      case "firewall":
        return <cylinderGeometry args={[0.6, 0.6, 1.2]} />
      default:
        return <sphereGeometry args={[0.6]} />
    }
  }

  return (
    <group position={node.position}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(node)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {getNodeGeometry()}
        <meshStandardMaterial
          color={getNodeColor()}
          emissive={getNodeColor()}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          transparent
          opacity={0.8}
        />
      </mesh>

      {hovered && (
        <Text position={[0, 1.5, 0]} fontSize={0.3} color="white" anchorX="center" anchorY="middle">
          {node.id}
        </Text>
      )}
    </group>
  )
}

function NetworkConnections({ nodes, connections, isPlaying }: { nodes: ThreatNode[]; connections: NetworkConnection[]; isPlaying: boolean }) {
  const linesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (!linesRef.current || !isPlaying) return
    const time = state.clock.getElapsedTime()

    linesRef.current.children.forEach((line, i) => {
      const connection = connections[i]
      if (connection?.type === "threat" && line.material) {
        (line.material as THREE.Material).opacity = 0.5 + Math.sin(time * 4) * 0.3
      }
    })
  })

  const getConnectionColor = (type: string) => {
    switch (type) {
      case "threat":
        return "#ff0044"
      case "blocked":
        return "#ff6600"
      default:
        return "#00ff88"
    }
  }

  return (
    <group ref={linesRef}>
      {connections.map((connection, index) => {
        const fromNode = nodes.find((n) => n.id === connection.from)
        const toNode = nodes.find((n) => n.id === connection.to)

        if (!fromNode || !toNode) return null

        const points = [new THREE.Vector3(...fromNode.position), new THREE.Vector3(...toNode.position)]

        return (
          <Line
            key={`${connection.from}-${connection.to}-${index}`}
            points={points}
            color={getConnectionColor(connection.type)}
            lineWidth={Math.max(connection.intensity * 3, 1)}
            transparent
            opacity={0.6}
          />
        )
      })}
    </group>
  )
}

function WorldMap() {
  const meshRef = useRef<THREE.Mesh>(null)
  
  // Create a world map texture
  const mapTexture = (() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const context = canvas.getContext('2d')
    
    if (context) {
      // Fill with ocean color
      context.fillStyle = '#1a4f63'
      context.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw continents (simplified representation)
      const continents = [
        // North America
        { x: 200, y: 100, width: 150, height: 150, color: '#2a6f83' },
        // South America
        { x: 230, y: 250, width: 100, height: 150, color: '#2a6f83' },
        // Europe
        { x: 500, y: 100, width: 100, height: 80, color: '#2a6f83' },
        // Africa
        { x: 520, y: 180, width: 100, height: 150, color: '#2a6f83' },
        // Asia
        { x: 650, y: 100, width: 200, height: 150, color: '#2a6f83' },
        // Australia
        { x: 800, y: 280, width: 120, height: 80, color: '#2a6f83' },
        // Antarctica
        { x: 400, y: 420, width: 300, height: 50, color: '#4a8fa3' }
      ]
      
      continents.forEach(continent => {
        context.fillStyle = continent.color
        context.beginPath()
        context.ellipse(
          continent.x, continent.y, 
          continent.width / 2, continent.height / 2, 
          0, 0, Math.PI * 2
        )
        context.fill()
      })
    }
    
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  })()

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshPhongMaterial
        map={mapTexture}
        emissive="#0a1f2e"
        emissiveIntensity={0.1}
        transparent
        opacity={0.95}
      />
    </mesh>
  )
}

function ThreatIndicator({ position, threat, isPlaying }: { position: [number, number, number]; threat: GlobalThreat; isPlaying: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)
  
  useFrame((state) => {
    if (!groupRef.current || !isPlaying) return
    const time = state.clock.getElapsedTime()
    
    // Pulsing animation
    const scale = 1 + Math.sin(time * 3) * 0.2 * threat.intensity
    groupRef.current.scale.set(scale, scale, scale)
  })
  
  const getThreatColor = () => {
    if (threat.intensity > 0.8) return "#ff0844"
    if (threat.intensity > 0.6) return "#ff3d00"
    if (threat.intensity > 0.4) return "#ff6d00"
    return "#ff9800"
  }

  return (
    <group ref={groupRef} position={position}>
      {/* Main threat indicator */}
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.06 + threat.intensity * 0.08]} />
        <meshBasicMaterial
          color={getThreatColor()}
          emissive={getThreatColor()}
          emissiveIntensity={0.9}
          transparent
          opacity={0.9}
        />
      </mesh>

      {hovered && (
        <Text position={[0, 0.3, 0]} fontSize={0.2} color="white" anchorX="center" anchorY="middle">
          {threat.attackType}
        </Text>
      )}
    </group>
  )
}

function ThreatGlobe({ isPlaying, threats }: { isPlaying: boolean; threats: GlobalThreat[] }) {
  const globeRef = useRef<THREE.Group>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (!globeRef.current || !atmosphereRef.current || !isPlaying) return
    const time = state.clock.getElapsedTime()

    globeRef.current.rotation.y = time * 0.02
    atmosphereRef.current.scale.setScalar(1 + Math.sin(time * 1.5) * 0.01)
  })

  const threatPositions = threats.map((threat) => {
    const phi = (90 - threat.lat) * (Math.PI / 180)
    const theta = (threat.lng + 180) * (Math.PI / 180)
    const radius = 5.1

    return {
      position: [
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta),
      ] as [number, number, number],
      threat,
    }
  })

  return (
    <group ref={globeRef}>
      {/* World Map Globe */}
      <WorldMap />

      {/* Atmosphere layers */}
      <mesh ref={atmosphereRef}>
        <sphereGeometry args={[5.15, 32, 32]} />
        <meshBasicMaterial color="#4a9eff" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Threat indicators */}
      {threatPositions.map(({ position, threat }, index) => (
        <ThreatIndicator key={threat.id} position={position} threat={threat} isPlaying={isPlaying} />
      ))}
    </group>
  )
}

export function SecurityVisualization3D() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [selectedNode, setSelectedNode] = useState<ThreatNode | null>(null)
  const [viewMode, setViewMode] = useState<"network" | "globe" | "particles">("globe")
  const [liveStats, setLiveStats] = useState({
    globalThreats: 0,
    blockedAttacks: 0,
    activeConnections: 0,
    threatLevel: "Medium",
  })
  const [liveThreats, setLiveThreats] = useState<GlobalThreat[]>([])

  // Generate live threat data
  useEffect(() => {
    const generateLiveThreats = () => {
      const threatTypes = ["DDoS", "Malware", "Phishing", "Ransomware", "Data Breach", "SQL Injection"]
      const majorCities = [
        { name: "New York", lat: 40.7128, lng: -74.006, country: "USA" },
        { name: "London", lat: 51.5074, lng: -0.1278, country: "UK" },
        { name: "Tokyo", lat: 35.6762, lng: 139.6503, country: "Japan" },
        { name: "Moscow", lat: 55.7558, lng: 37.6176, country: "Russia" },
        { name: "Beijing", lat: 39.9042, lng: 116.4074, country: "China" },
        { name: "Mumbai", lat: 19.076, lng: 72.8777, country: "India" },
        { name: "São Paulo", lat: -23.5505, lng: -46.6333, country: "Brazil" },
        { name: "Sydney", lat: -33.8688, lng: 151.2093, country: "Australia" },
      ]

      const newThreats = majorCities.map((city, i) => ({
        id: `threat-${i}-${Date.now()}`,
        lat: city.lat + (Math.random() - 0.5) * 10,
        lng: city.lng + (Math.random() - 0.5) * 10,
        intensity: Math.random() * 0.8 + 0.2,
        type: "cyber-attack",
        country: city.country,
        city: city.name,
        attackType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        timestamp: Date.now(),
        duration: Math.floor(Math.random() * 600) + 60,
        sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        targetIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      }))

      setLiveThreats(newThreats)
    }

    generateLiveThreats()
    const interval = setInterval(generateLiveThreats, 5000)

    return () => clearInterval(interval)
  }, [])

  // Update live stats
  useEffect(() => {
    const updateStats = () => {
      const criticalThreats = liveThreats.filter(t => t.intensity > 0.7).length
      
      setLiveStats({
        globalThreats: liveThreats.length,
        blockedAttacks: Math.floor(Math.random() * 1000) + 500,
        activeConnections: Math.floor(Math.random() * 200) + 100,
        threatLevel: criticalThreats > 5 ? "Critical" : 
                    criticalThreats > 3 ? "High" : 
                    criticalThreats > 1 ? "Medium" : "Low",
      })
    }

    updateStats()
    const interval = setInterval(updateStats, 3000)
    return () => clearInterval(interval)
  }, [liveThreats])

  // Sample network data
  const [nodes] = useState<ThreatNode[]>([
    {
      id: "firewall-01",
      position: [0, 0, 0],
      type: "firewall",
      severity: "low",
      connections: ["server-01", "server-02"],
      data: { status: "active", rules: 1247 },
    },
    {
      id: "server-01",
      position: [5, 2, 3],
      type: "server",
      severity: "low",
      connections: ["user-01", "user-02"],
      data: { cpu: 45, memory: 67 },
    },
    {
      id: "server-02",
      position: [-3, -2, 4],
      type: "server",
      severity: "medium",
      connections: ["user-03"],
      data: { cpu: 78, memory: 89 },
    },
    {
      id: "threat-01",
      position: [8, -3, -2],
      type: "threat",
      severity: "critical",
      connections: ["server-01"],
      data: { type: "malware", blocked: false },
    },
    {
      id: "threat-02",
      position: [-6, 4, -3],
      type: "threat",
      severity: "high",
      connections: ["server-02"],
      data: { type: "ddos", blocked: true },
    },
    {
      id: "user-01",
      position: [10, 0, 6],
      type: "user",
      severity: "low",
      connections: [],
      data: { sessions: 3, location: "US" },
    },
    {
      id: "user-02",
      position: [7, 5, 2],
      type: "user",
      severity: "low",
      connections: [],
      data: { sessions: 1, location: "EU" },
    },
  ])

  const [connections] = useState<NetworkConnection[]>([
    { from: "firewall-01", to: "server-01", type: "normal", intensity: 0.8 },
    { from: "firewall-01", to: "server-02", type: "normal", intensity: 0.6 },
    { from: "server-01", to: "user-01", type: "normal", intensity: 0.5 },
    { from: "server-01", to: "user-02", type: "normal", intensity: 0.4 },
    { from: "server-02", to: "user-03", type: "normal", intensity: 0.7 },
    { from: "threat-01", to: "server-01", type: "threat", intensity: 1.0 },
    { from: "threat-02", to: "server-02", type: "blocked", intensity: 0.9 },
  ])

  const handleNodeClick = (node: ThreatNode) => {
    setSelectedNode(node)
  }

  const controlsRef = useRef<any>()

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <div className="border-2 border-primary/20 bg-background/95 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-xl font-bold">Advanced 3D Global Threat Visualization</h2>
              <p className="text-sm text-muted-foreground">Real-time global cybersecurity monitoring</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className={`px-3 py-2 rounded ${viewMode === "network" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setViewMode("network")}
            >
              Network
            </button>
            <button
              className={`px-3 py-2 rounded ${viewMode === "globe" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setViewMode("globe")}
            >
              Globe
            </button>
            <button
              className={`px-3 py-2 rounded ${viewMode === "particles" ? "bg-blue-500" : "bg-gray-700"}`}
              onClick={() => setViewMode("particles")}
            >
              Particles
            </button>
            <button className="px-3 py-2 bg-gray-700 rounded" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button className="px-3 py-2 bg-gray-700 rounded" onClick={resetCamera}>
              Reset View
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Visualization */}
        <div className="lg:col-span-3">
          <div className="border-2 border-primary/20 bg-background/95 rounded-lg overflow-hidden">
            <div className="w-full h-[600px] bg-gradient-to-br from-black to-blue-950 rounded-lg overflow-hidden relative">
              <Canvas
                camera={{ position: [15, 10, 15], fov: 60 }}
                gl={{ antialias: true }}
                onCreated={({ gl }) => {
                  gl.setClearColor("#000011")
                }}
              >
                <ambientLight intensity={0.3} />
                <pointLight position={[10, 10, 10]} intensity={1.2} />
                <pointLight position={[-10, -10, -10]} intensity={0.6} color="#ff0044" />

                {viewMode === "network" && (
                  <>
                    {nodes.map((node) => (
                      <NetworkNode key={node.id} node={node} onClick={handleNodeClick} isPlaying={isPlaying} />
                    ))}
                    <NetworkConnections nodes={nodes} connections={connections} isPlaying={isPlaying} />
                  </>
                )}

                {viewMode === "globe" && <ThreatGlobe isPlaying={isPlaying} threats={liveThreats} />}

                {viewMode === "particles" && <ThreatParticles isPlaying={isPlaying} />}

                <OrbitControls
                  ref={controlsRef}
                  enablePan={true}
                  enableZoom={true}
                  enableRotate={true}
                  autoRotate={isPlaying && viewMode === "globe"}
                  autoRotateSpeed={0.3}
                  minDistance={8}
                  maxDistance={50}
                />
              </Canvas>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-4">
          <div className="border-2 border-primary/20 bg-background/95 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Live Global Threats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm items-center">
                <span>Active Threats:</span>
                <span className="bg-red-500 px-2 py-1 rounded">{liveStats.globalThreats}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span>Blocked Attacks:</span>
                <span className="bg-green-500 px-2 py-1 rounded">{liveStats.blockedAttacks}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span>Connections:</span>
                <span className="bg-blue-500 px-2 py-1 rounded">{liveStats.activeConnections}</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span>Threat Level:</span>
                <span className={`px-2 py-1 rounded ${
                  liveStats.threatLevel === "Critical" ? "bg-red-700" : 
                  liveStats.threatLevel === "High" ? "bg-orange-500" : 
                  liveStats.threatLevel === "Medium" ? "bg-yellow-500" : "bg-green-500"
                }`}>
                  {liveStats.threatLevel}
                </span>
              </div>
            </div>
          </div>

          {selectedNode && (
            <div className="border-2 border-primary/20 bg-background/95 p-4 rounded-lg">
              <h3 className="text-lg font-bold mb-3">Selected Node</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <div className="font-semibold">{selectedNode.id}</div>
                  <div>Type: {selectedNode.type}</div>
                  <div>Severity: {selectedNode.severity}</div>
                </div>
                <div className="text-xs space-y-1">
                  {Object.entries(selectedNode.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="border-2 border-primary/20 bg-background/95 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded"></div>
                <span>Servers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>Firewalls</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded"></div>
                <span>Users</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>Critical Threats</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-400 rounded"></div>
                <span>High Threats</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                <span>Medium Threats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}