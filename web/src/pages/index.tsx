import Link from 'next/link';

import { Main } from '../styles/home';

export default function Home() {
    return (
        <Main>
            <h1>
                Watching videos with friends <span>made easy</span>
            </h1>
            <h2>
                Don't worry anymore with syncing manually your videos.
                <br />
                Nevermore you would say '1, 2, 3 play'.
            </h2>

            <div>
                <button className="login">
                    <Link href="signup">Sign up</Link>
                </button>
                <button>
                    <Link href="signin">Sign in</Link>
                </button>
            </div>

            <img src="assets/home.svg" />
        </Main>
    );
}
