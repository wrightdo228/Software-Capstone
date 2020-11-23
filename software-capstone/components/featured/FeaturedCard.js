import styled from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
import UserAvatar from '../general/UserAvatar';
import Icon from '../buttons/Icon';

const BlurContainer = styled.div`
    width: 100%;
    background-image: url('https://hackernoon.com/hn-images/1*Kv-0AsHcK7WRrUDOH8YLIA.png');
    filter: blur(1.8px);
    height: 236px;
`;

const Container = styled.div`
    color: #fff;
    border-radius: 10px;
    position: relative;
    overflow: hidden;

    .feature-content {
        padding-left: 14px;
        padding-bottom: 20px;
        position: absolute;
        bottom: 0;
        display: flex;
        align-items: flex-end;

        img {
            margin-right: 7px;
        }

        p {
            font-size: 12px;
        }

        h5 {
            font-size: 16px;
            margin-bottom: 6px;
            font-weight: 700;
        }
    }

    .username {
        color: #0092e4;
        font-weight: 400;
        font-style: italic;
        font-size: 12px;
    }

    .favorite-content {
        top: 11px;
        right: 14px;
        position: absolute;
        display: flex;

        svg {
            margin-left: 9px;
        }
    }
`;

const FeaturedCard = () => (
    <Container>
        <Link href="#">
            <a>
                <BlurContainer />
                <div className="feature-content">
                    <UserAvatar type="mini" />
                    <div>
                        <h5>React Tips For New Developers</h5>
                        <p>
                            by{' '}
                            <Link href="#">
                                <a className="username">GreatProgrammer</a>
                            </Link>
                        </p>
                    </div>
                </div>
                <div className="favorite-content">
                    <p>(100)</p>
                    <Icon type="favorite" />
                </div>
            </a>
        </Link>
    </Container>
);

FeaturedCard.propTypes = {};

export default FeaturedCard;
