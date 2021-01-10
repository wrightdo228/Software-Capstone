import { useState } from 'react';
import CreateCollection from '../../components/forms/CreateCollection';

const Collections = () => {
    const [formOpen, setFormOpen] = useState();

    return (
        <form>
            {formOpen && (
                <CreateCollection
                    onClose={() => setFormOpen(false)}
                    open={formOpen}
                />
            )}
            <button type="button" onClick={() => setFormOpen(true)}>
                Create
            </button>
        </form>
    );
};

export default Collections;
