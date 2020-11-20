import styled from 'styled-components';

const Container = styled.div`
    background-color: #fff;
    padding: 20px 0;
    border-bottom: 1px solid #c4c4c4;
    position: sticky;
    top: 0;

    input {
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

const Navbar = () => (
    <Container>
        <div id="content">
            <div id="left-placeholder" />
            <input />
            <div id="nav-items">
                <a>Home</a>
                <a>Featured</a>
                <a>Profile</a>
            </div>
        </div>
    </Container>
);

export default Navbar;
