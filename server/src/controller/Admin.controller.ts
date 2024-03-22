import prisma from '../utils/prisma'
import bcrypt from 'bcrypt'

export const getChains = async (req, res) => {
  const chains = await prisma.chain.findMany()
  res.json(chains)
}

export const getChain = async (req, res) => {
  const { chainId } = req.params
  try {
    const chain = await prisma.chain.findUnique({
      where: {
        id: chainId,
      },
      include: {
        venues: true,
        _count: {
          select: { venues: true },
        },
      },
    })
    res.json(chain)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createChain = async (req, res) => {
  const { name } = req.body
  console.log(name)
  try {
    const isChainExist = await prisma.chain.findFirst({
      where: {
        name: name,
      },
    })
    if (isChainExist) {
      return res.status(400).json({ error: 'Chain already exist' })
    }
    const chain = await prisma.chain.create({
      data: {
        name,
      },
    })
    console.log(`✅ Chain ${name} created`)
    res.json(chain)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createAdmin = async (req, res) => {
  const { username, password } = req.body
  const { chainId } = req.params

  const usernameExists = await prisma.user.findUnique({
    where: {
      username: username,
      // chainId: chainId,
    },
  })

  if (usernameExists) return res.status(400).json({ error: 'Username already exists' })

  if (!username || !password) return res.status(400).json({ error: 'Username and password are required' })
  try {
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await prisma.user.create({
      data: {
        username: username,
        password: passwordHash,
        role: 'ADMIN',
        chainId: chainId,
      },
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
