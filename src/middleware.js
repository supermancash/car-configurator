import {NextResponse} from "next/server";


export function middleware(request) {

    let cookie = request.cookies.get('sessionid');

    if (cookie === undefined) {
        const response = NextResponse.next()
        response.cookies.set('sessionid', crypto.randomUUID(), {secure: true})
        cookie = response.cookies.get('sessionid')
        return response
    }

}
