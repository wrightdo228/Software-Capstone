import styled from 'styled-components';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const Container = styled.div`
    background-color: #fff;
    padding: 20px 0;
    border-bottom: 1px solid #c4c4c4;
    position: sticky;
    top: 0;
    z-index: 100;

    form {
        width: 50%;
    }

    #nav-items {
        width: 25%;
        display: flex;
        justify-content: flex-end;

        a {
            font-weight: 700;
            font-size: 12px;
            transition: color 0.2s ease;
            cursor: pointer;

            &:hover {
                color: #a81010;
            }
        }

        & > a:nth-child(1n + 2) {
            margin-left: 12px;
        }
    }

    #content {
        display: flex;
        align-items: center;
        max-width: 1704px;
        width: 100%;
        margin: 0 auto;
    }

    #left-placeholder {
        content: '';
        width: 25%;
    }
`;

const Navbar = () => {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');
    const excludeSearchBar = ['/login', '/_error', '/register'].includes(
        router.pathname,
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (searchValue.trim()) {
            router.push(
                `/search?searchParams=${searchValue}`,
                `/search/${searchValue}`,
            );
        }
    };

    return excludeSearchBar ? null : (
        <Container>
            <div id="content">
                <div id="left-placeholder" />
                <form onSubmit={handleSubmit}>
                    <input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </form>
                <div id="nav-items">
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                    <Link href="/featured">
                        <a>Featured</a>
                    </Link>
                    <Link href="/profile">
                        <a>Profile</a>
                    </Link>
                </div>
            </div>
        </Container>
    );
};

export default Navbar;
