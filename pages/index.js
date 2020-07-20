import React, { Component } from "react";
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';
class CampaignIndex extends Component {
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return { campaigns }
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(
            address => {
                return {
                    header: address,
                    description: <Link route={`/campaigns/${address}`}><a>View Campaign</a></Link>,
                    fluid: true
                }
            }
        );

        return <Card.Group items={items} />
    }

    render() {
        return <React.Fragment>
            <Layout>
                <Link route='/campaigns/new'>
                    <a>
                        <Button content="Create Campaign" floated="right" icon="add circle" primary />

                    </a>

                </Link>
                {this.renderCampaigns()}
            </Layout>
        </React.Fragment>
    };
}

export default CampaignIndex;