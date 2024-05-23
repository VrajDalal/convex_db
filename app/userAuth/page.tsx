import type { UserIdentity } from 'convex/server';
import { query } from '@/convex/_generated/server';


export default query(async (ctx) => {

    const user = await ctx.auth.getUserIdentity()
    console.log(user)
    
    if (user == null) {
        return null
    }
    return user.tokenIdentifier
}) 