'use client'

import { useState, useEffect } from 'react'
import { Bone, Cat, Dog, Fish, PawPrint, Rabbit, Squirrel, Turtle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

const icons = [
  { component: Bone, name: 'Bone' },
  { component: Cat, name: 'Cat' },
  { component: Dog, name: 'Dog' },
  { component: Fish, name: 'Fish' },
  { component: PawPrint, name: 'PawPrint' },
  { component: Rabbit, name: 'Rabbit' },
  { component: Squirrel, name: 'Squirrel' },
  { component: Turtle, name: 'Turtle' },
]

const gameCards = [...icons, ...icons].map((icon, i) => ({ ...icon, id: i }))

function shuffle(array: any[]) {
  return array.sort(() => Math.random() - 0.5)
}

export function MemoryGame() {
  const [cards, setCards] = useState(shuffle([...gameCards]))
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [isWon, setIsWon] = useState(false)

  useEffect(() => {
    if (flipped.length === 2) {
      const [first, second] = flipped
      if (cards[first].name === cards[second].name) {
        setMatched((prev) => [...prev, cards[first].name])
      }
      setTimeout(() => setFlipped([]), 800)
    }
  }, [flipped, cards])

  useEffect(() => {
    if (matched.length === icons.length) {
      setIsWon(true)
    }
  }, [matched])

  const handleClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(cards[index].name)) {
      return
    }
    setFlipped((prev) => [...prev, index])
  }

  const handleRestart = () => {
    setCards(shuffle([...gameCards]))
    setFlipped([])
    setMatched([])
    setIsWon(false)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            onClick={() => handleClick(index)}
            className={cn(
              "flex h-20 w-20 cursor-pointer items-center justify-center transition-transform duration-300",
              (flipped.includes(index) || matched.includes(card.name)) ? "transform rotate-y-180 bg-primary/10" : "bg-muted"
            )}
            style={{ transformStyle: "preserve-3d" }}
          >
            <CardContent className="p-0 flex items-center justify-center h-full w-full">
              {(flipped.includes(index) || matched.includes(card.name)) ? (
                <card.component className="h-10 w-10 text-primary" />
              ) : (
                <div className="h-10 w-10" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      {isWon && (
        <div className="text-center">
            <p className="text-2xl font-bold text-primary">You won!</p>
            <button onClick={handleRestart} className="mt-2 text-sm underline">Play Again?</button>
        </div>
      )}
    </div>
  )
} 