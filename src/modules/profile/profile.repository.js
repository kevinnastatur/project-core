const prisma = require('../../config/database')

class ProfileRepository {
  async getProfile(userId) {
    return await prisma.user.findFirst({
      where: {
        id: userId,
      },
      include: {
        role: {
          select: { slug: true, userType: true, access: true },
        },
      },
    })
  }

  async updateProfile(userId, data) {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    })
  }
}

module.exports = new ProfileRepository()
